import { render, fireEvent, getByTestId } from '@testing-library/react';
import React, { ReactPropTypes } from "react";
import { OrderBookHeader, OrderBookHeaderProps } from './OrderBookHeader';

const renderComponent = (props: OrderBookHeaderProps) => {
  return render(<OrderBookHeader {...props} />);
}

const defaultProps: React.PropsWithChildren<OrderBookHeaderProps> = {
  groups: [1,2,3],
  currentGroup: 1,
  groupChanged: jest.fn(),
  children: <span>Children</span>,
}

describe(OrderBookHeader.name, () => {
  it("should call groupChanged callback", () => {
    const props: OrderBookHeaderProps = {
      ...defaultProps
    };
    const selectedValue = 2;
    const renderedComponent = renderComponent(props);

    fireEvent.change(getByTestId(renderedComponent.container, "order-book-select"), {
      target: {
        value: selectedValue,
      }
    });

    expect(props.groupChanged).toHaveBeenCalledWith(selectedValue);
  });

  it("should render", () => {
    const renderedComponent = renderComponent(defaultProps);

    expect(renderedComponent.asFragment()).toMatchSnapshot();
  });
});
