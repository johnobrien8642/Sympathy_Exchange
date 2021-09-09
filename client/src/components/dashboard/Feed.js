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
    if (fetchMoreBoolRef.current) {
      var fetchPleaFeed = fetchMoreWithClient(
        client,
        filter,
        lastPleaSympathyCountRef.current,
        FETCH_PLEA_FEED,
        true
      );

      setCursor(fetchPleaFeed, lastPleaSympathyCountRef)
      fetchMoreBoolRef.current = false;
    }
  }, [fetchMoreBoolRef.current])

  if (loading) return 'Loading...';
  if (error) return `Feed Error: ${error.message}`;

  if (!fetchMoreBoolRef.current) {
    setCursor(data.fetchPleaFeed, lastPleaSympathyCountRef);
  }
  console.log(data.fetchPleaFeed.length)
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