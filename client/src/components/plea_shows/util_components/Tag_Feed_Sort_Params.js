import React from 'react';

const TagFeedSortParams = ({
  filter,
  setFilter,
  fetchMoreBoolRef,
  lastPleaSympathyCountRef
}) => {

  return (
    <div
      className='tag-feed-sort-container'
    >
      <button
        className='sort-button'
        onClick={e => {
          e.preventDefault();
          const { floor, ceiling, tagIdArr, bySympCount, byTagIds } = filter;

          setFilter({
            floor: floor,
            ceiling: ceiling,
            tagIdArr: tagIdArr,
            bySympCount: bySympCount,
            byTagIds: byTagIds,
            feedSort: 'bySympathyCount'
          })

          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;
        }}
      >
        Sympathy Count
      </button>
      <button
        className='sort-button'
        onClick={e => {
          const { floor, ceiling, tagIdArr, bySympCount, byTagIds } = filter;
          e.preventDefault();

          setFilter({
            floor: floor,
            ceiling: ceiling,
            tagIdArr: tagIdArr,
            bySympCount: bySympCount,
            byTagIds: byTagIds,
            feedSort: 'byCreatedAt'
          })

          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;
        }}
      >
        Created Date
      </button>
    </div>
  )
};

export default TagFeedSortParams;