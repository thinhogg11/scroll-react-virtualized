import React, { useEffect, useState } from "react";
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { listItems } from "./Helper/ListItems";

import { Tweet } from "./Helper/Tweet";
const cache = new CellMeasurerCache({
  defaultHeight: 85,
  fixedWidth: true,
});
const Example = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setData(listItems);
  }, []);
  const isRowLoaded = ({ index }) => {
    return !!data[index];
  };

  const loadMoreRows = () => {
    console.log("loadMoreRows", isLoading);
    if (isLoading) {
      Promise.resolve();
    } else
      Promise.resolve().then(() => {
        setIsLoading(true);
        const prevTweets = data;
        const nextTweets = [...prevTweets, ...listItems];

        setTimeout(() => {
          setIsLoading(false);
          setData(nextTweets);
        }, 600);
      });
  };
  const infiniteRowCount = () => (!isLoading ? data.length + 1 : data.length);
  const listRowCount = () => data.length + 1;

  const renderRow = ({ index, key, parent, style }) => {
    const tweet = data[index];

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style} className="row">
            {isRowLoaded({ index }) ? (
              <Tweet
                key={tweet.created_at}
                index={index}
                measure={measure}
                {...tweet}
              />
            ) : (
              <div>loading</div>
            )}
          </div>
        )}
      </CellMeasurer>
    );
  };
  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={infiniteRowCount()}
      threshold={0}
      minimumBatchSize={1}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, scrollTop, onChildScroll }) => (
            <AutoSizer disableHeight={true}>
              {({ width }) => (
                <List
                  autoHeight={true}
                  height={height}
                  isScrolling={isScrolling}
                  onRowsRendered={(any) => {
                    onRowsRendered(any);
                    // console.log(any);
                  }}
                  onScroll={onChildScroll}
                  overscanRowCount={5}
                  ref={(el) => {
                    registerChild(el);
                  }}
                  rowHeight={cache.rowHeight}
                  rowRenderer={renderRow}
                  rowCount={listRowCount()}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
};

export default Example;
