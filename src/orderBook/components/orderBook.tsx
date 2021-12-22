import {FC, createContext} from "react";

export interface FeedConfig {
  feedId: string;
  groupOptions: number[];
  defaultGroup: number;
}

export type FeedConfigs = Record<string, FeedConfig>;
export interface OrderBookContext {
  feedConfig: FeedConfig;
}
export enum FeedIds = {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
};

export const FeedConfigs: FeedConfigs = {
  "PI_XBTUSD": {
    feedId: "PI_XBTUSD",
    groupOptions: [0.5, 1, 2.5],
    defaultGroup: 0.5,
  },
  "PI_ETHUSD": {
    feedId: "PI_ETHUSD",
    groupOptions: [0.05, 0.1, 0.25],
    defaultGroup: 0.05,
  },
};

const defaultFeedConfig = FeedConfigs[FeedIds.PI_XBTUSD];
export const OrderBookContext = createContext<OrderBookContext>({
  feedConfig: defaultFeedConfig,
});

export const OrderBook: FC<void> = () => {
  const [feedConfig, setFeedConfig] = useState(defaultFeedConfig);

  return (
    <OrderBookContext.Provider value={feedConfig: defaultFeedConfig}>
      <OrderBookHeader></OrderBookHeader>
      <OrderBookBidPanel></OrderBookBidPanel>
      <OrderBookAskPanel></OrderBookAskPanel>
      <OrderBookFooter></OrderBookFooter>
    </OrderBookContext.Provider>
  );

};
