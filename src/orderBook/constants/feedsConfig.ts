import type {FeedConfigRecord} from "../types/feed";

export const FeedsConfig: FeedConfigRecord = {
  "PI_XBTUSD": {
    feedId: "PI_XBTUSD",
    groupOptions: [0.5, 1, 2.5],
    defaultGroupIndex: 0,
  },
  "PI_ETHUSD": {
    feedId: "PI_ETHUSD",
    groupOptions: [0.05, 0.1, 0.25],
    defaultGroupIndex: 0,
  },
};

