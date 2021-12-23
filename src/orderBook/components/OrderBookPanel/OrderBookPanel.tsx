import React, { FC } from "react";
import styles from "./OrderBookPanel.module.css";

export enum OrderBookPanelType {
  asks = "asks",
  bids = "bids",
}

export type OrderBookPanelProps = {
  values: Map<number, number>;
  type: OrderBookPanelType;
};

export const OrderBookPanel: FC<OrderBookPanelProps> = (props) => {
  const rows: JSX.Element[] = [];
  let acc = 0;
  props.values.forEach((size: number, price: number) => {
    acc += size;
    rows.push(<div key={price} className={styles.item}>
      <span>{acc}</span>
      <span>{size}</span>
      <span className={styles.price}>{price}</span>
    </div>);
  })
  return <div className={`${styles.main} ${styles[props.type]}`}>
    <div className={`${styles.header}`}>
      <span>Total</span>
      <span>Size</span>
      <span>Price</span>
    </div>
    {rows}
  </div>;
}
