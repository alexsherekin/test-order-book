import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import styles from "./OrderBookFooter.module.css";

export interface OrderBookFooterProps {
  isConnected: boolean;
  toggleFeedClicked: () => void;
  killReconnectFeedClicked: () => void;
};

export const OrderBookFooter: FC<OrderBookFooterProps> = (props) => {
  return (
    <div className={styles.footer}>
      <Button className={styles.button} variant="primary" onClick={props.toggleFeedClicked}>Toggle feed</Button>
      <Button className={styles.button} variant="danger" onClick={props.killReconnectFeedClicked}>
        {props.isConnected ? "Kill feed" : "Reconnect"}
      </Button>
    </div>
  );
};
