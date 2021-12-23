import { useEffect, useState } from 'react';
import { FeedId } from '../types/feed';

type MessageData = {
  bids: Map<number, number>;
  asks: Map<number, number>;
};

type GroupedData = {
  bids: Map<number, number>;
  asks: Map<number, number>;
};

interface OrderBookMessage {
  feed: string;
  product_id: string;
  bids: undefined | [number, number][];
  asks: undefined | [number, number][];
};

const createSubscriptionMessage = (feedId: FeedId): string => {
  return JSON.stringify({"event":"subscribe","feed":"book_ui_1","product_ids":[feedId]});
}

const createUnsubscriptionMessage = (feedId: FeedId): string => {
  return JSON.stringify({"event":"unsubscribe","feed":"book_ui_1","product_ids":[feedId]});
}

export const useOrderBookData = (feedId: FeedId, groupSize: number): [boolean, boolean, GroupedData, () => void, () => void] => {
  const [messageData, setMessageData] = useState<MessageData>({ bids: new Map<number, number>(), asks: new Map<number, number>()});
  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [isConnectionFailed, setIsConnectionFailed] = useState<boolean>(false);
  const [groupedData, setGroupedData] = useState<GroupedData>({
    bids: new Map<number, number>(),
    asks: new Map<number, number>(),
  });
  const [killConnectionCallback, setKillConnectionCallback] = useState<() => void>(() => {});
  const [forceReconnect, setForceReconnect] = useState<Object>({});

  useEffect(() => {
    const asks = new Map<number, number>();
    const bids = new Map<number, number>();
    const webSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    webSocket.onopen = (e: Event) => {
      setIsConnectionOpen(true);
      setIsConnectionFailed(false);
      webSocket.send(createSubscriptionMessage(feedId));
    };
    webSocket.onmessage = (ev: MessageEvent<string>) => {
      let data!: OrderBookMessage;
      try {
        data = JSON.parse(ev.data);
      } catch (error) {
        console.error(error);
        return;
      }

      data.bids?.forEach(([price, size]) => {
        if (size === 0) {
          bids.delete(price);
        } else {
          bids.set(price, size);
        }
      });

      data.asks?.forEach(([price, size]) => {
        if (size === 0) {
          asks.delete(price);
        } else {
          asks.set(price, size);
        }
      });

      setMessageData({asks, bids});
    };
    webSocket.onerror = () => {
      setIsConnectionFailed(true);
      setIsConnectionOpen(false);
      webSocket.close();
    };
    webSocket.onclose = () => {
      setIsConnectionOpen(false);
    };

    setKillConnectionCallback(() => webSocket.onerror);

    return () => {
      webSocket.send(createUnsubscriptionMessage(feedId));
      webSocket.close();
    };
  }, [feedId, forceReconnect]);

  useEffect(() => {
    const groups: GroupedData = {
      bids: new Map<number, number>(),
      asks: new Map<number, number>(),
    };

    messageData.bids.forEach((size: number, price: number) => {
      const groupMinPrice = price - price % groupSize;
      groups.bids.set(groupMinPrice, (groups.bids.get(groupMinPrice) ?? 0) + size);
    });

    messageData.asks.forEach((size: number, price: number) => {
      const groupMinPrice = price - price % groupSize;
      groups.asks.set(groupMinPrice, (groups.asks.get(groupMinPrice) ?? 0) + size);
    });

    setGroupedData({
      bids: new Map<number, number>(Array.from(groups.bids.entries()).sort((a,b) => b[0] - a[0])),
      asks: new Map<number, number>(Array.from(groups.asks.entries()).sort((a,b) => a[0] - b[0])),
    });
  }, [groupSize, messageData]);

  return [
    isConnectionOpen,
    isConnectionFailed,
    groupedData,
    killConnectionCallback,
    () => setForceReconnect({}),
  ];
};
