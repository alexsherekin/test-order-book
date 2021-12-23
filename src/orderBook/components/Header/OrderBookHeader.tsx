import React, { FC } from 'react';
import styles from "./OrderBookHeader.module.css";

export interface OrderBookHeaderProps {
  groups: number[];
  currentGroup: number;
  groupChanged: (group: number) => void;
};

export const OrderBookHeader: FC<OrderBookHeaderProps> = (props) => {
  return (
    <div className={styles.header}>
      <span>Order book</span>
      <select
        id="order-book-group"
        value={props.currentGroup}
        onChange={e => props.groupChanged(Number(e.target.value))}>
        {
          props.groups.map((group, index) => <option key={group} value={index}>Group {group}</option>)
        }
      </select>
    </div>
  );
};
