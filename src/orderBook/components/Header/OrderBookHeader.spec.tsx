import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { OrderBookHeader, OrderBookHeaderProps } from "./OrderBookHeader";

const doRenderComponent = (props: OrderBookHeaderProps) => {
  return render(<OrderBookHeader {...props} />);
}

const defaultProps: React.PropsWithChildren<OrderBookHeaderProps> = {
  groups: [1,2,3],
  currentGroup: 1,
  groupChanged: jest.fn(),
  children: <span>Children</span>,
}

describe(`${OrderBookHeader.name}`, () => {
  it("should call groupChanged callback", () => {
    const props: OrderBookHeaderProps = {
      ...defaultProps
    };
    const selectedValue = 2;
    doRenderComponent(props);

    fireEvent.change(screen.getByTestId("order-book-select"), {
      target: {
        value: selectedValue,
      }
    });

    expect(props.groupChanged).toHaveBeenCalledWith(selectedValue);
  });

  it("should render", () => {
    const {asFragment} = doRenderComponent(defaultProps);

    expect(asFragment()).toMatchSnapshot();
  });
});
