import React from "react";
import {render} from "@testing-library/react";
import {OrderBookFooter} from "./OrderBookFooter";

describe(OrderBookFooter.name.toString(), () => {
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
    const {asFragment} = render(<OrderBookFooter {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
