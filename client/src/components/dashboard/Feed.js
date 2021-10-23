import React, { useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import PleaShow from '../plea_shows/Plea_Show';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedUtil from './util_functions/feed_util.js';
import Queries from '../../graphql/queries';
const { FETCH_PLEA_FEED } = Queries;
const { fetchMoreWithClient, setCursor } = FeedUtil;

const Feed = ({
  filter,
  lastPleaSympathyCountRef,
  lastObjectIdRef,
  fetchMoreBoolRef
}) => {
  const client = useApolloClient();

  // feed query can be dynamic, either for fetching everything or fetching
  // with a filter

  let { loading, error, data } = useQuery(FETCH_PLEA_FEED, {
    variables: {
      filter: filter,
      cursor: lastPleaSympathyCountRef.current
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
        true
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
    ]
  )

  if (loading) return 'Loading...';
  if (error) return `Feed Error: ${error.message}`;

  if (!fetchMoreBoolRef.current) {
    setCursor(data.fetchPleaFeed, lastPleaSympathyCountRef, lastObjectIdRef);
  }

  return (
      <div
        className='feed'
      >
        <InfiniteScroll
          dataLength={data.fetchPleaFeed.length}
          next={() => fetchMoreWithClient(
              client,
              filter,
              lastPleaSympathyCountRef.current,
              lastObjectIdRef.current,
              FETCH_PLEA_FEED
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
          {data.fetchPleaFeed.map(plea => {
            console.log(plea)
            return (
              <React.Fragment
                key={plea._id}
              >
                <PleaShow plea={plea} />
              </React.Fragment>
            )
          })}
        </InfiniteScroll>
      </div>
  );
};

export default Feed;