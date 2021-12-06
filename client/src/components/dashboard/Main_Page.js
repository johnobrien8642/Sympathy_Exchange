import React, { useState, useRef } from 'react';
import Feed from './Feed';
import HandleSetFilter from '../plea_shows/util_components/Handle_Set_Filter';

const MainPage = () => {
  let [filter, setFilter] = useState({
    floor: null,
    ceiling: null,
    rangeArr: [],
    tagIdArr: [],
    bySympCount: false,
    byTagIds: false
  });
  let lastPleaSympathyCountRef = useRef(null);
  let lastObjectIdRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);

  return(
    <div
      className='mainPageContainer'
    >
      <div
        className='col1'
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
        className='col2'
      >
        <Feed
          filter={filter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          lastObjectIdRef={lastObjectIdRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
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