export interface FeedConfig {
  feedId: string;
  groupOptions: number[];
  defaultGroupIndex: number;
}

export type FeedConfigRecord = Record<string, FeedConfig>;

export enum FeedId {
  PI_XBTUSD = "PI_XBTUSD",
  PI_ETHUSD = "PI_ETHUSD",
};
