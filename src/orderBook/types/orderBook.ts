export type OrderBookItem = {price: number; size: number; total: number;};

export type OrderBookData = {
  bids: OrderBookItem[];
  asks: OrderBookItem[];
};

export interface OrderBookMessage {
  feed: string;
  product_id: string;
  bids: undefined | [number, number][];
  asks: undefined | [number, number][];
};
