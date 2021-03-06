import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import Loading from '../shared_util/Loading';
import PleaShow from '../plea_shows/Plea_Show';
import ActivityShow from './Activity_Show';
import SearchInput from './Search_Input';
import FollowedList from '../plea_shows/util_components/Followed_List';
import InfiniteScroll from 'react-infinite-scroll-component';
import TagOrUserSortOrQueryParams from '../plea_shows/util_components/Tag_Or_User_Sort_Or_Query_Params';
import FeedUtil from './util_functions/feed_util.js';
import Queries from '../../graphql/queries';
const { FETCH_FEED, CURRENT_USER_ID } = Queries;
const { fetchMoreWithClient, setCursor } = FeedUtil;

const Feed = ({
  tag,
  user,
  feedType,
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  lastObjectIdRef,
  fetchMoreBoolRef
}) => {
  let [searchInput, setSearchInput] = useState('');
  const client = useApolloClient();
  const { pathname } = useLocation();
  let pathRef = useRef(pathname);
  let kindRef = useRef('');
  let inputRef = useRef(null);
  const { isActivity } = feedType;
  
  //Feed query can be dynamic, either for fetching everything or fetching
  //with a filter
  
  //NOTE: The loading var is only used to render a loading spinner
  //at the end of the plea feed. Optional chaining is used throughout 
  //to check if data has arrived yet.
  let { loading, error, data } = useQuery(FETCH_FEED, {
    variables: {
      fetchFeedInputs: {
        filter: filter,
        cursor: lastPleaSympathyCountRef.current,
        tagId: tag ? tag._id : null,
        userId: user ? user._id : null,
        searchInput: searchInput,
        activity: isActivity
      }
    }
  });

  let { data: userData } = useQuery(CURRENT_USER_ID);
  
  useEffect(() => {
    console.log(pathRef.current !== pathname)
    if (pathRef.current !== pathname) {
      fetchMoreBoolRef.current = true;
      lastPleaSympathyCountRef.current = null;
      pathRef.current = pathname;
    };
    
    //There seems to be an unresolved issue with Apollo's fetchMore,
    //which breaks when a user navigates away from the page and then back.
    //Until this bug is resolved I use an instance of useApolloClient and
    //just manually call the query with appropriate variables

    async function asyncFetchMoreWithClient() {
      return await fetchMoreWithClient(
        client,
        filter,
        lastPleaSympathyCountRef.current,
        lastObjectIdRef.current,
        FETCH_FEED,
        fetchMoreBoolRef.current,
        tag,
        user,
        searchInput,
        isActivity
      );
    };

    if (fetchMoreBoolRef.current) {
      const fetchFeed = asyncFetchMoreWithClient();
      setCursor(fetchFeed, lastPleaSympathyCountRef, isActivity);
      fetchMoreBoolRef.current = false;
    }
  },
    [
      client,
      fetchMoreBoolRef,
      filter,
      lastPleaSympathyCountRef,
      lastObjectIdRef,
      tag,
      user,
      searchInput,
      isActivity,
      pathname
    ]
  );

  function handleLoadingIcon() {
    if (loading) {
      return <Loading />;
    }
  };

  if (error) return `Feed Error: ${error.message}`;

  if (!fetchMoreBoolRef.current) {
    setCursor(data?.fetchFeed, lastPleaSympathyCountRef, isActivity, lastObjectIdRef);
  };

  return (
      <div
        className='feed'
      >
        <TagOrUserSortOrQueryParams
          user={user}
          currentUser={userData?.currentUserId === user?._id}
          setSearchInput={setSearchInput}
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
          kindRef={kindRef}
          inputRef={inputRef}
        />
        <SearchInput
          setSearchInput={setSearchInput}
          inputRef={inputRef}
        />
        <FollowedList
          user={user}
          active={!!kindRef.current}
          kind={kindRef.current}
        />
        <InfiniteScroll
          dataLength={data?.fetchFeed ? data.fetchFeed.length : 0}
          next={() => fetchMoreWithClient(
              client,
              filter,
              lastPleaSympathyCountRef.current,
              lastObjectIdRef.current,
              FETCH_FEED,
              fetchMoreBoolRef.current,
              tag,
              user,
              searchInput,
              isActivity
            )
          }
          hasMore={true}
          endMessage={
            <div
              className='feedEndMsg'
            >
              <p>This is the end for these Pleas</p>
            </div>
          }
        >
          {data?.fetchFeed.map(obj => {
            if (isActivity) {
              return (
                <React.Fragment
                  key={obj._id}
                >
                  <ActivityShow activity={obj} />
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment
                  key={obj._id}
                >
                  <PleaShow plea={obj} />
                </React.Fragment>
              )
            }
          })}
          {handleLoadingIcon()}
        </InfiniteScroll>
      </div>
  );
};

export default Feed;