import React, { FC, useMemo } from "react";
import styles from "./OrderBookPanel.module.css";

export enum OrderBookPanelType {
  asks = "asks",
  bids = "bids",
}

export type OrderBookPanelProps = {
  values: Map<number, number>;
  type: OrderBookPanelType;
};

// Ideally this should be dynamic and depend on a panel width
const MAX_ROWS = 20;

export const OrderBookPanel: FC<OrderBookPanelProps> = (props) => {
  const rows = useMemo(() => {
    const rows: JSX.Element[] = [];
    let acc = 0;
    props.values.forEach((size: number, price: number) => {
      acc += size;
      rows.push(<div key={price} className={styles.item}>
        <span>{acc}</span>
        <span>{size}</span>
        <span className={styles.price}>{price}</span>
      </div>);

      if (rows.length === MAX_ROWS) {
        return rows;
      }
    });
    return rows;
  }, [props.values]);

  return (
    <div className={`${styles.main} ${styles[props.type]}`}>
      <div className={`${styles.header}`}>
        <span>Total</span>
        <span>Size</span>
        <span>Price</span>
      </div>
      {rows}
    </div>
  );
}
