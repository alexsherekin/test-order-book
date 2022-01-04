import { useEffect, useState } from 'react';
import { FeedId } from '../types/feed';
import { OrderBookData, OrderBookMessage } from '../types/orderBook';

type MessageData = {
  bids: Map<number, number>;
  asks: Map<number, number>;
};

type UseOrderBookDataProps = {
  feedId: FeedId;
  groupSize: number;
}

type UseOrderBookDataResult = {
  isConnectionOpen: boolean,
  isConnectionFailed: boolean,
  groupedData: OrderBookData,
  killConnectionCallback: () => void,
  setForceReconnectProvider: () => void,
}

export const createSubscriptionMessage = (feedId: FeedId): string => {
  return JSON.stringify({"event":"subscribe","feed":"book_ui_1","product_ids":[feedId]});
}

export const createUnsubscriptionMessage = (feedId: FeedId): string => {
  return JSON.stringify({"event":"unsubscribe","feed":"book_ui_1","product_ids":[feedId]});
}

const dataAdjustmentCallback = (data: Map<number, number>) => {
  return ([price, size]: [number, number]) => {
    if (size === 0) {
      data.delete(price);
    } else {
      data.set(price, size);
    }
  }
};

const grouppingCallback = (groupSize: number, groupedData: [number, number][]) => {
  const priceToIndexMap = new Map<number, number>();

  return (size: number, price: number) => {
    const groupMinPrice = price - price % groupSize;
    const indexInResultArray = priceToIndexMap.get(groupMinPrice) ?? groupedData.length;
    if (indexInResultArray === groupedData.length) {
      priceToIndexMap.set(groupMinPrice, indexInResultArray);
      groupedData.push([groupMinPrice, 0]);
    }

    groupedData[indexInResultArray][1] += size;
  };
};

export const useOrderBookData = ({feedId, groupSize} : UseOrderBookDataProps): UseOrderBookDataResult => {
  const [messageData, setMessageData] = useState<MessageData>({ bids: new Map<number, number>(), asks: new Map<number, number>()});
  const [isConnectionOpen, setIsConnectionOpen] = useState<boolean>(false);
  const [isConnectionFailed, setIsConnectionFailed] = useState<boolean>(false);
  const [groupedData, setGroupedData] = useState<OrderBookData>({
    bids: [],
    asks: [],
  });
  const [killConnectionCallback, setKillConnectionCallback] = useState<() => void>(() => {});
  const [forceReconnect, setForceReconnect] = useState<Object>({});

  useEffect(() => {
    const asks = new Map<number, number>();
    const bids = new Map<number, number>();
    const webSocket = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    let requestAnimationFrameHandler: number = 0;
    webSocket.onopen = (e: Event) => {
      setIsConnectionOpen(true);
      setIsConnectionFailed(false);
      webSocket.send(createSubscriptionMessage(feedId));
    };
    webSocket.onmessage = (ev: MessageEvent<string>) => {
      let data: undefined | OrderBookMessage;
      try {
        data = JSON.parse(ev.data);
      } catch (error) {
        console.error(error);
        return;
      }

      // Message is not related to the current feed
      if (data?.product_id !== feedId) {
        return;
      }

      data.bids?.forEach(dataAdjustmentCallback(bids));
      data.asks?.forEach(dataAdjustmentCallback(asks));

      if (!requestAnimationFrameHandler) {
        requestAnimationFrameHandler = requestAnimationFrame(() => {
          setMessageData({asks, bids});
          requestAnimationFrameHandler = 0;
        });
      }
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

      if (requestAnimationFrameHandler) {
        cancelAnimationFrame(requestAnimationFrameHandler);
      }
    };
  }, [feedId, forceReconnect]);

  useEffect(() => {
    const bids: [number, number][] = [];
    messageData.bids.forEach(grouppingCallback(groupSize, bids));
    const asks: [number, number][] = [];
    messageData.asks.forEach(grouppingCallback(groupSize, asks));

    let bidsTotal = 0;
    let asksTotal = 0;
    setGroupedData({
      bids: bids.sort((a,b) => b[0] - a[0]).map(([price, size]) => {
        return {
          price,
          size,
          total: bidsTotal+= size,
        };
      }),
      asks: asks.sort((a,b) => a[0] - b[0]).map(([price, size]) => {
        return {
          price,
          size,
          total: asksTotal+= size,
        };
      }),
    });
  }, [groupSize, messageData]);

  return {
    isConnectionOpen,
    isConnectionFailed,
    groupedData,
    killConnectionCallback,
    setForceReconnectProvider: () => setForceReconnect({}),
  };
};
