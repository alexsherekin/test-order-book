import React, { FC, useMemo } from "react";
import { OrderBookItem } from '../../types/orderBook';
import styles from "./OrderBookPanel.module.css";

export enum OrderBookPanelType {
  asks = "asks",
  bids = "bids",
}

export type OrderBookPanelProps = {
  values: OrderBookItem[];
  type: OrderBookPanelType;
  precision: number;
};

// Ideally this should be dynamic and depend on a panel width
const MAX_ROWS = 30;

export const OrderBookPanel: FC<OrderBookPanelProps> = (props) => {
  const rows = useMemo(() => {
    const trimmedValues = [...props.values];
    trimmedValues.length = MAX_ROWS;
    const rows: JSX.Element[] = [];
    const maxTotal = Math.max(...trimmedValues.map(value => value.total));
    trimmedValues.forEach(({price, size, total}) => {
      const lineWidthStyle = {"--total-line-width": `${total / maxTotal * 100}%`};
      rows.push(<div key={price} className={styles.item} style={lineWidthStyle as any}>
        <span>{total}</span>
        <span>{size}</span>
        <span className={styles.price}>{price.toFixed(props.precision)}</span>
      </div>);
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
