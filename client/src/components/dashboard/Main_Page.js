import React, { useState, useRef } from 'react';
import Feed from './Feed';
import Filter from '../plea_shows/util_components/Filter';

const MainPage = () => {
  let [filter, setFilter] = useState({
    floor: null,
    ceiling: null,
    tagIdArr: [],
    bySympCount: false,
    byTagIds: false
  });
  let lastPleaSympathyCountRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);

  return(
    <div
      className='mainPageContainer'
    >
      <div
        className='col1'
      >
        <Filter
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
          setFilter={setFilter}
          filter={filter}
        />
      </div>
      <div
        className='col2'
      >
        <Feed
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
          filter={filter}
        />
      </div>
      <div
        className='col3'
      >
        These are the recents
      </div>
    </div>
  )
};

export default MainPage;