import React, { useRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';

import UserResult from '../search/resultTypes/User_Result';

import Queries from '../../graphql/queries.js';
import FeedUtil from '../posts/util/functions/feed_util.js';
const { FETCH_FOLLOWED_USERS } = Queries;
const { infiniteScroll, 
        updateCacheInfScrollFollowedUsers, 
        handleData } = FeedUtil;

const UserFollowersFeed = () => {
  let feedArr = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFollowedUsers');
  let gqlQuery = useRef(FETCH_FOLLOWED_USERS)
  let query = useRef(Cookies.get('currentUser'));
  let endOfPosts = useRef(false);
  const client = useApolloClient();

  useEffect(() => {
  
    var scroll = infiniteScroll(
      client, updateCacheInfScrollFollowedUsers,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )

    return () => {
      document.removeEventListener('scroll', scroll)
      refetch()
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data, refetch } = useQuery(gqlQuery.current, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: null
    },
    // fetchPolicy: 'no-cache'
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)
  
  return(
    <div>
      <div>
        {feedArr.current.map((followed, i) => {
          return (
            <div
              key={followed.follows._id}
              className='followedResult'
            >
              <UserResult
                user={followed.follows}
              />
            </div>
          )
        })}
        </div>
        <div
          id='fetchMoreFollowedUsers'
        >
        </div>
    </div>
  )
}

export default UserFollowersFeed;