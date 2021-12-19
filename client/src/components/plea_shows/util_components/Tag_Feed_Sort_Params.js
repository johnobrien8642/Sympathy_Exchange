import React, { useRef } from 'react';

const TagFeedSortParams = ({
  user,
  currentUser,
  filter,
  setFilter,
  fetchMoreBoolRef,
  lastPleaSympathyCountRef
}) => {
  let bySympathizedRef = useRef(false);
  let bySavedRef = useRef(false);
  let byUserFollowsRef = useRef(false);
  let byTagFollowsRef = useRef(false);
  let bySympCountRef = useRef(false);
  let byCreatedAtRef = useRef(false);

  function handleUserQueryParams() {
    if (currentUser) {
      return (
        <>
          <button
            className={`sort-button sympathized-pleas ${bySympathizedRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;

              if (bySympathizedRef.current) {
                let newObj = {...filter};
                newObj.bySympathizedPleaIds = [];
                bySympathizedRef.current = false;
                setFilter(newObj);
              } else {
                let newObj = {...filter};
                newObj.bySympathizedPleaIds = user.sympathizedPleaIdsStringArr;
                bySympathizedRef.current = true;
                setFilter(newObj)
              }
            }}
          >
            Sympathized Pleas
          </button>
          <button
            className={`sort-button saved-pleas ${bySavedRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;

              if (bySavedRef.current) {
                let newObj = {...filter};
                newObj.bySavedPleaIds = [];
                bySavedRef.current = false;
                setFilter(newObj);
              } else {
                let newObj = {...filter};
                newObj.byavedPleaIds = user.savedPleaIdsStringArr;
                bySavedRef.current = true;
                setFilter(newObj)
              }
            }}
          >
            Saved Pleas
          </button>
          <button
            className={`sort-button user-follows ${byUserFollowsRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;

              if (byUserFollowsRef.current) {
                let newObj = {...filter};
                newObj.byUserFollows = [];
                byUserFollowsRef.current = false;
                setFilter(newObj);
              } else {
                let newObj = {...filter};
                newObj.byUserFollows = user.userFollowIdsStringArr;
                byUserFollowsRef.current = true;
                setFilter(newObj)
              }
            }}
          >
            Followed Users
          </button>
          <button
            className={`sort-button tag-follows ${byTagFollowsRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;

              if (byTagFollowsRef.current) {
                let newObj = {...filter};
                newObj.byTagFollows = [];
                byTagFollowsRef.current = false;
                setFilter(newObj);
              } else {
                let newObj = {...filter};
                newObj.byTagFollows = user.tagFollowIdsStringArr;
                byTagFollowsRef.current = true;
                setFilter(newObj)
              }
            }}
          >
            Followed Tags
          </button>
        </>
      )
    }
  }

  return (
    <div
      className='tag-feed-sort-container'
    >
      {handleUserQueryParams()}
      <button
        className={`sort-button by-symp-count ${bySympCountRef.current ? 'selected' : ''}`}
        onClick={e => {
          e.preventDefault();
          bySympCountRef.current = !bySympCountRef.current;
          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;
          let newObj = {...filter};
          newObj.feedSort = 'bySympathyCount';
          setFilter(newObj);
        }}
      >
        Sympathy Count
      </button>
      <button
        className={`sort-button by-symp-count ${byCreatedAtRef.current ? 'selected' : ''}`}
        onClick={e => {
          e.preventDefault();
          byCreatedAtRef.current = !byCreatedAtRef.current;
          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;

          let newObj = {...filter};
          newObj.feedSort = 'byCreatedAt';
          setFilter(newObj)
        }}
      >
        Created Date
      </button>
    </div>
  )
};

export default TagFeedSortParams;