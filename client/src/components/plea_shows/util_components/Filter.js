import React from 'react';
import SympathyCountFilterParams from './Sympathy_Count_Filter_Params';
import TagFilterParams from './Tag_Filter_Params';

const Filter = ({
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  fetchMoreBoolRef
}) => {
  
  return (
    <div
      className='filterContainer'
    >
      <SympathyCountFilterParams
        filter={filter}
        setFilter={setFilter}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
      />
      <TagFilterParams 
        filter={filter}
        setFilter={setFilter}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
      />
    </div>
  );
};

export default Filter;