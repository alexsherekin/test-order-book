import React from "react";
import {render} from '@testing-library/react';
import {OrderBookFooter, OrderBookFooterProps} from "./OrderBookFooter";

const renderComponent = (props: OrderBookFooterProps) => {
  return render(<OrderBookFooter {...props} />);
}

describe(OrderBookFooter.name, () => {
  it.each([
    [
      {
        isConnected: true,
        toggleFeedClicked(){},
        killReconnectFeedClicked(){},
      }
    ],
    [
      {
        isConnected: false,
        toggleFeedClicked(){},
        killReconnectFeedClicked(){},
      },
    ]
  ])("should render", (props) => {
    const renderedComponent = renderComponent(props);

    expect(renderedComponent.asFragment()).toMatchSnapshot();
  });
});
