import React, { useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import Loading from '../shared_util/Loading';
import PleaShow from '../plea_shows/Plea_Show';
import InfiniteScroll from 'react-infinite-scroll-component';
import TagFeedSortParams from '../plea_shows/util_components/Tag_Feed_Sort_Params';
import FeedUtil from './util_functions/feed_util.js';
import Queries from '../../graphql/queries';
const { FETCH_PLEA_FEED } = Queries;
const { fetchMoreWithClient, setCursor } = FeedUtil;

const Feed = ({
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  lastObjectIdRef,
  fetchMoreBoolRef,
  tag
}) => {
  
  const client = useApolloClient();
  
  //Feed query can be dynamic, either for fetching everything or fetching
  //with a filter
  
  //NOTE: The loading var is only used to render a loading spinner
  //at the end of the plea feed. Optional chaining is used throughout 
  //to check if data has arrived yet.
  let { loading, error, data } = useQuery(FETCH_PLEA_FEED, {
    variables: {
      filter: filter,
      cursor: lastPleaSympathyCountRef.current,
      tagBool: tag ? true : false
    }
  });

  useEffect(() => {

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
        FETCH_PLEA_FEED,
        fetchMoreBoolRef.current,
        tag ? true : false
      );
    }

    if (fetchMoreBoolRef.current) {
      const fetchPleaFeed = asyncFetchMoreWithClient();
      
      setCursor(fetchPleaFeed, lastPleaSympathyCountRef)
      fetchMoreBoolRef.current = false;
    }
  }, 
    [
      client,
      fetchMoreBoolRef,
      filter,
      lastPleaSympathyCountRef,
      lastObjectIdRef,
      tag
    ]
  )

  function handleLoadingIcon() {
    if (loading) {
      return <Loading />;
    }
  }

  if (error) return `Feed Error: ${error.message}`;
  


  if (!fetchMoreBoolRef.current) {
    setCursor(data?.fetchPleaFeed, lastPleaSympathyCountRef, lastObjectIdRef);
  }

  return (
      <div
        className='feed'
      >
        <TagFeedSortParams
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
        <InfiniteScroll
          dataLength={data?.fetchPleaFeed ? data.fetchPleaFeed.length : 0}
          next={() => fetchMoreWithClient(
              client,
              filter,
              lastPleaSympathyCountRef.current,
              lastObjectIdRef.current,
              FETCH_PLEA_FEED,
              fetchMoreBoolRef.current,
              tag ? true : false
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
          {data?.fetchPleaFeed.map(plea => {
            return (
              <React.Fragment
                key={plea._id}
              >
                <PleaShow plea={plea} />
              </React.Fragment>
            )
          })}
          {handleLoadingIcon()}
        </InfiniteScroll>
      </div>
  );
};

export default Feed;