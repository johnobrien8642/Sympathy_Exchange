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
  let lastPleaSympathyCount = useRef(null);

  return(
    <div
      className='mainPageContainer'
    >
      <div
        className='col1'
      >
        <Filter
          lastPleaSympathyCountRef={lastPleaSympathyCount}
          setFilter={setFilter}
          filter={filter}
        />
      </div>
      <div
        className='col2'
      >
        <Feed
          lastPleaSympathyCountRef={lastPleaSympathyCount}
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