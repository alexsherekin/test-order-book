import React, {FC, useCallback, useState} from "react";
import { FeedsConfig } from "../../constants/feedsConfig";
import { useOrderBookData } from "../../hooks/useOrderBookData";
import { FeedId } from "../../types/feed";
import { OrderBookPanel, OrderBookPanelType } from "../OrderBookPanel/OrderBookPanel";
import { OrderBookFooter } from "../Footer/OrderBookFooter";
import { OrderBookHeader } from "../Header/OrderBookHeader";
import styles from "./OrderBook.module.css";

type OrderBookState = {
  currentFeedId: FeedId,
  groupState: Record<FeedId, {currentGroupIndex: number}>,
};

export const OrderBook: FC = () => {
  const [state, setState] = useState<OrderBookState>({
    currentFeedId: FeedId.PI_XBTUSD,
    groupState: {
      [FeedId.PI_XBTUSD]: {
        currentGroupIndex: FeedsConfig[FeedId.PI_XBTUSD].defaultGroupIndex,
      },
      [FeedId.PI_ETHUSD]: {
        currentGroupIndex: FeedsConfig[FeedId.PI_ETHUSD].defaultGroupIndex,
      },
    },
  });

  const getCurrentGroupIndex = (): number => {
    return state.groupState[state.currentFeedId].currentGroupIndex;
  };

  const getCurrentGroupSize = (): number => {
    return FeedsConfig[state.currentFeedId].groupOptions[getCurrentGroupIndex()];
  };

  const getCurrentGroupPrecision = (): number => {
    return FeedsConfig[state.currentFeedId].precision;
  };

  const {isConnectionOpen, isConnectionFailed, groupedData, killConnectionCallback: killConnection, setForceReconnectProvider: reconnect} = useOrderBookData({feedId: state.currentFeedId, groupSize: getCurrentGroupSize()});

  const groupChanged = useCallback((groupIndex: number) => {
    setState({
      ...state,
      groupState: {
        ...state.groupState,
        [state.currentFeedId]: {
          currentGroupIndex: groupIndex,
        },
      },
    });
  }, [state]);

  const toggleFeed = useCallback(() => {
    const nextFeedId: FeedId = (state.currentFeedId === FeedId.PI_XBTUSD) ?
      FeedId.PI_ETHUSD :
      FeedId.PI_XBTUSD;

    setState(actualState => ({
      ...actualState,
      currentFeedId: nextFeedId,
    }));
  }, [state.currentFeedId]);

  const spreadAbs = (groupedData.asks[0]?.price && groupedData.bids[0]?.price) ? groupedData.asks[0].price - groupedData.bids[0].price : 0;
  const spreadPercents = groupedData.asks[0]?.price ? (spreadAbs / (groupedData.asks[0].price) * 100) : 0;

  return (
    <section className={styles.main}>
      <header className={styles.header}>
        <OrderBookHeader
          groups={FeedsConfig[state.currentFeedId].groupOptions}
          currentGroup={getCurrentGroupIndex()}
          groupChanged={groupChanged}>
            <span>{`Spread  ${spreadAbs.toFixed(1)} (${spreadPercents.toFixed(2)}%)`}</span>
        </OrderBookHeader>
      </header>
      <div className={styles.panels}>
        <div className={isConnectionFailed ? styles["connection-issue"] : styles.hidden}>
          Connection is lost or unstable. Displayed data may be unaccurate.
        </div>
        <div className={styles["bids-panel"]}>
          <OrderBookPanel values={groupedData.bids} type={OrderBookPanelType.bids} precision={getCurrentGroupPrecision()}></OrderBookPanel>
        </div>
        <div className={styles["asks-panel"]}>
          <OrderBookPanel values={groupedData.asks} type={OrderBookPanelType.asks} precision={getCurrentGroupPrecision()}></OrderBookPanel>
        </div>
      </div>
      <footer className={styles.footer}>
        <OrderBookFooter toggleFeedClicked={toggleFeed} killReconnectFeedClicked={isConnectionOpen ? killConnection : reconnect} isConnected={isConnectionOpen}></OrderBookFooter>
      </footer>
    </section>
  );
};
