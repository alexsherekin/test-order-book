import { renderHook, act } from "@testing-library/react-hooks";
import { MockWebSocket } from '../../tests/mockWebSocket';
import { FeedId } from '../types/feed';
import { OrderBookMessage } from '../types/orderBook';
import { createSubscriptionMessage, createUnsubscriptionMessage, useOrderBookData } from './useOrderBookData'

const render = (feedId: FeedId, groupSize: number) => {
  return renderHook((props) => useOrderBookData(props), {
    initialProps: {feedId, groupSize}
  });
};

describe(useOrderBookData.name, () => {
  let mockedWebSocket: WebSocket;
  beforeEach(() => {
    mockedWebSocket = new MockWebSocket("");
    mockedWebSocket.send = jest.fn();
    mockedWebSocket.close = jest.fn();
    global.requestAnimationFrame = (callback) => {
      callback(0);
      return 1;
    };
    jest.spyOn(global, "WebSocket").mockImplementation(() => mockedWebSocket);
  });

  it("should set flags after opening", () => {
    const {result} = render(FeedId.PI_XBTUSD, 1);

    act(() => {
      mockedWebSocket.onopen!(new Event("mock"));
    });

    expect(result.current.isConnectionFailed).toBe(false);
    expect(result.current.isConnectionOpen).toBe(true);
  });

  it("should subscribe after opening", () => {
    const feedId = FeedId.PI_XBTUSD;
    render(feedId, 1);

    act(() => {
      mockedWebSocket.onopen!(new Event("mock"));
    });

    expect(mockedWebSocket.send).toHaveBeenCalledWith(createSubscriptionMessage(feedId));
  });

  it("should set flags after closing", () => {
    const {result} = render(FeedId.PI_XBTUSD, 1);

    act(() => {
      mockedWebSocket.onopen!(new Event("mock"));
      mockedWebSocket.onclose!(new CloseEvent("mock"));
    });

    expect(result.current.isConnectionFailed).toBe(false);
    expect(result.current.isConnectionOpen).toBe(false);
  });

  it("should set flags after failure", () => {
    // Similar to "should set flags after closing"
  });

  it("should clean up when feedId changes", () => {
    let feedId = FeedId.PI_XBTUSD;
    let groupSize = 1;
    const {result, rerender} = render(feedId, groupSize);

    const oldFeedId = feedId;
    act(() => {
      mockedWebSocket.onopen!(new Event("mock"));
      feedId = FeedId.PI_ETHUSD;
      rerender({feedId, groupSize});
    });

    expect(mockedWebSocket.send).toHaveBeenLastCalledWith(createUnsubscriptionMessage(oldFeedId));
    expect(mockedWebSocket.close).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      {
        inputMessages: [
          {
            data: JSON.stringify({
              feed: "",
              product_id: FeedId.PI_XBTUSD,
              bids: [[1,1], [2,2], [3,3]],
              asks: [[4,4], [5,5], [6,6]],
            } as OrderBookMessage),
          } as unknown as MessageEvent<string>,
        ],
        expectation: {
          bids: [
            {price: 3, size: 3, total: 3},
            {price: 2, size: 2, total: 5},
            {price: 1, size: 1, total: 6},
          ],
          asks: [
            {price: 4, size: 4, total: 4},
            {price: 5, size: 5, total: 9},
            {price: 6, size: 6, total: 15},
          ],
        },
      },
      {
        inputMessages: [
          {
            data: JSON.stringify({
              feed: "",
              product_id: FeedId.PI_XBTUSD,
              bids: [[1,1], [2,2], [3,3]],
              asks: [[4,4], [5,5], [6,6]],
            } as OrderBookMessage),
          } as unknown as MessageEvent<string>,
          {
            data: JSON.stringify({
              feed: "",
              product_id: FeedId.PI_XBTUSD,
              bids: [[1,0]],
              asks: [[5,0]],
            } as OrderBookMessage),
          } as unknown as MessageEvent<string>,
        ],
        expectation: {
          bids: [
            {price: 3, size: 3, total: 3},
            {price: 2, size: 2, total: 5},
          ],
          asks: [
            {price: 4, size: 4, total: 4},
            {price: 6, size: 6, total: 10},
          ],
        },
      },
      {
        inputMessages: [
          {
            data: JSON.stringify({
              feed: "",
              product_id: FeedId.PI_XBTUSD,
              bids: [],
              asks: [[4,4], [6,6]],
            } as OrderBookMessage),
          } as unknown as MessageEvent<string>,
          {
            data: JSON.stringify({
              feed: "",
              product_id: FeedId.PI_XBTUSD,
              bids: [[1,1]],
              asks: [],
            } as OrderBookMessage),
          } as unknown as MessageEvent<string>,
        ],
        expectation: {
          bids: [
            {price: 1, size: 1, total: 1},
          ],
          asks: [
            {price: 4, size: 4, total: 4},
            {price: 6, size: 6, total: 10},
          ],
        },
      }
    ]
  ])("should process and group data", ({inputMessages, expectation}) => {
    const {result} = render(FeedId.PI_XBTUSD, 1);

    act(() => {
      mockedWebSocket.onopen!(new Event("mock"));
      inputMessages.forEach(part => {
        mockedWebSocket.onmessage!(part);
      });
    });

    expect(result.current.groupedData).toEqual(expectation);
  });

  it("should ignore wrong messages", () => {});

  // killConnectionCallback and setForceReconnectProvider are not covered with tests
  // because they are not related to the actual functionality and serve rather for easy UI testing
});
