import React, { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PleaShow from '../plea_shows/Plea_Show';
import InfiniteScroll from 'react-infinite-scroll-component';
import Queries from '../../graphql/queries';
const { FETCH_PLEA_FEED } = Queries;

const Feed = ({
  filter
}) => {
  let lastPleaSympathyCount = useRef(null);
  // feed query can be dynamic, either for fetching everything or fetching
  // with a filter

  let { loading, error, data, refetch: fetchMorePleas } = useQuery(FETCH_PLEA_FEED, {
    variables: {
      filter: filter,
      cursor: lastPleaSympathyCount.current
    }
  });

  useEffect(() => {
    if (data && data.fetchPleaFeed.length > 0) {
      lastPleaSympathyCount.current =
        data.fetchPleaFeed[data.fetchPleaFeed.length - 1].sympathyCount
    }
  }, [data]);

  if (loading) return 'Loading...';
  if (error) return `Feed Error: ${error.message}`;
  
  return (
      <div
        className='feed'
      >
        <InfiniteScroll
          dataLength={data.fetchPleaFeed.length}
          next={fetchMorePleas}
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