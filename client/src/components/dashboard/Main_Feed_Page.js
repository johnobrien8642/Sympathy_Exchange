import React, { useState, useRef } from 'react';
import Feed from './Feed';
import RecentFeed from './Recent_Feed';
import HandleSetFilter from '../plea_shows/util_components/Handle_Set_Filter';

const MainPage = () => {
  let [filter, setFilter] = useState({
    floor: null,
    ceiling: null,
    rangeArr: [],
    tagIdArr: [],
    bySympCount: false,
    byTagIds: false,
    feedSort: 'bySympathyCount'
  });
  let lastPleaSympathyCountRef = useRef(null);
  let lastObjectIdRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);

  return(
    <div
      className='main-feed-page-container'
    >
      <div
        className='col-1'
      >
        <HandleSetFilter
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          lastObjectIdRef={lastObjectIdRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
          setFilter={setFilter}
          filter={filter}
        />
      </div>
      <div
        className='col-2'
      >
        <Feed
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          lastObjectIdRef={lastObjectIdRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
      </div>
      <div
        className='col-3'
      >
        <RecentFeed />
      </div>
    </div>
  )
};

export default MainPage;