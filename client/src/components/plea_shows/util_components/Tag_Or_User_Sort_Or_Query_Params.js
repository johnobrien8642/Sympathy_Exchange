import React, { useRef } from 'react';
import FollowedList from './Followed_List';

const TagOrUserSortOrQueryParams = ({
  user,
  currentUser,
  filter,
  setFilter,
  fetchMoreBoolRef,
  lastPleaSympathyCountRef
}) => {
  //query useRef hooks
  let bySympathizedRef = useRef(false);
  let bySavedRef = useRef(false);
  let byUserFollowsRef = useRef(false);
  let byTagFollowsRef = useRef(false);
  let kindRef = useRef('');

  //sort useRef hooks
  let bySympCountRef = useRef(false);
  let byCreatedAtRef = useRef(false);

  function resetOtherParams(param, newObj) {
    if (param === 'bySympathizedPleaIds') {
      //reset other query useRef hooks
      bySavedRef.current = false;
      byUserFollowsRef.current = false;
      byTagFollowsRef.current = false;
      kindRef.current = '';

      //reset filter keys
      newObj.bySavedPleaIds = false;
      newObj.bySavedPleaIdsArr = [];
      newObj.byUserFollows = false;
      newObj.byUserFollowsArr = [];
      newObj.byTagFollows = false;
      newObj.byTagFollowsArr = [];
    }

    if (param === 'bySavedPleaIds') {
      //reset other query useRef hooks
      bySympathizedRef.current = false;
      byUserFollowsRef.current = false;
      byTagFollowsRef.current = false;
      kindRef.current = '';

      //reset filter keys
      newObj.bySympathizedPleaIds = false;
      newObj.bySympathizedPleaIdsArr = [];
      newObj.byUserFollows = false;
      newObj.byUserFollowsArr = [];
      newObj.byTagFollows = false;
      newObj.byTagFollowsArr = [];
    }

    if (param === 'byUserFollows') {
      //reset other query useRef hooks
      bySympathizedRef.current = false;
      bySavedRef.current = false;
      byTagFollowsRef.current = false;
      kindRef.current = 'user';

      //reset filter keys
      newObj.bySympathizedPleaIds = false;
      newObj.bySympathizedPleaIdsArr = [];
      newObj.bySavedPleaIds = false;
      newObj.bySavedPleaIdsArr = [];
      newObj.byTagFollows = false;
      newObj.byTagFollowsArr = [];
    }

    if (param === 'byTagFollows') {
      //reset other query useRef hooks
      bySympathizedRef.current = false;
      bySavedRef.current = false;
      byUserFollowsRef.current = false;
      kindRef.current = 'tag';

      //reset filter keys
      newObj.bySympathizedPleaIds = false;
      newObj.bySympathizedPleaIdsArr = [];
      newObj.bySavedPleaIds = false;
      newObj.bySavedPleaIdsArr = [];
      newObj.byUserFollows = false;
      newObj.byUserFollowsArr = [];
    }
  }

  function handleUserQueryParams() {
    if (currentUser) {
      return (
        <>
          <button
            className={`query-button sympathized-pleas ${bySympathizedRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              
              if (bySympathizedRef.current) {
                bySympathizedRef.current = false;

                let newObj = {...filter};
                newObj.bySympathizedPleaIds = false;
                newObj.bySympathizedPleaIdsArr = [];
                setFilter(newObj);
              } else {
                
                let newObj = {...filter};
                newObj.bySympathizedPleaIds = true;
                newObj.bySympathizedPleaIdsArr = user.sympathizedPleaIdsStringArr;
                resetOtherParams('bySympathizedPleaIds', newObj);
                bySympathizedRef.current = true;
                setFilter(newObj);
              }

              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;
            }}
          >
            Sympathized Pleas
          </button>
          <button
            className={`query-button saved-pleas ${bySavedRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              if (bySavedRef.current) {
                bySavedRef.current = false;

                let newObj = {...filter};
                newObj.bySavedPleaIds = false;
                newObj.bySavedPleaIdsArr = [];
                setFilter(newObj);
              } else {
                
                let newObj = {...filter};
                newObj.bySavedPleaIds = true;
                newObj.bySavedPleaIdsArr = user.savedPleaIdsStringArr;
                resetOtherParams('bySavedPleaIds', newObj);
                bySavedRef.current = true;
                setFilter(newObj);
              }

              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;
            }}
          >
            Saved Pleas
          </button>
          <button
            className={`query-button user-follows ${byUserFollowsRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.preventDefault();
              
              if (byUserFollowsRef.current) {
                byUserFollowsRef.current = false;
                kindRef.current = '';
                let newObj = {...filter};
                newObj.byUserFollows = false;
                newObj.byUserFollowsArr = [];
                setFilter(newObj);
              } else {
                
                let newObj = {...filter};
                newObj.byUserFollows = true;
                newObj.byUserFollowsArr = user.userFollowIdsStringArr;
                resetOtherParams('byUserFollows', newObj);
                byUserFollowsRef.current = true;
                setFilter(newObj);
              }

              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;
            }}
          >
            Followed Users
          </button>
          <button
            className={`query-button tag-follows ${byTagFollowsRef.current ? 'selected' : ''}`}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              
              if (byTagFollowsRef.current) {
                byTagFollowsRef.current = false;
                kindRef.current = '';
                let newObj = {...filter};
                newObj.byTagFollows = false;
                newObj.byTagFollowsArr = [];
                setFilter(newObj);
              } else {
                
                let newObj = {...filter};
                newObj.byTagFollows = true;
                newObj.byTagFollowsArr = user.tagFollowIdsStringArr;
                resetOtherParams('byTagFollows', newObj);
                byTagFollowsRef.current = true;
                setFilter(newObj);
              }
              
              lastPleaSympathyCountRef.current = null;
              fetchMoreBoolRef.current = true;
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
          byCreatedAtRef.current = false;
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
          bySympCountRef.current = false;
          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;

          let newObj = {...filter};
          newObj.feedSort = 'byCreatedAt';
          setFilter(newObj)
        }}
      >
        Created Date
      </button>
      <FollowedList 
        user={user}
        active={!!kindRef.current}
        kind={kindRef.current}
      />
    </div>
  )
};

export default TagOrUserSortOrQueryParams;