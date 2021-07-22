import React, { useRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import UserResult from '../search/resultTypes/User_Result';
import CheckOutTheseBlogs from '../dashboard/util/Check_Out_These_Blogs';

import Queries from '../../graphql/queries.js';
import FeedUtil from '../posts/util/functions/feed_util.js';
import ActivityUtil from '../nav/util/activity_util.js';
const { handleActivity, handleTimeAgo } = ActivityUtil;
const { FETCH_USER_FOLLOWERS, 
        FETCH_FOLLOWED_USERS, 
        FETCH_ALL_ACTIVITY } = Queries;
const { infiniteScroll, 
        updateCacheInfScrollUserFollowers, 
        updateCacheInfScrollFollowedUsers,
        handleData, 
        setgqlQueryUserFollowedOrFollowingOrActivity } = FeedUtil;

const UserFollowersOrFollowingFeed = () => {
  let feedArr = useRef([]);
  let timeAgoRef = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFollowers');
  let gqlQuery = useRef(FETCH_USER_FOLLOWERS)
  let query = useRef(Cookies.get('currentUser'));
  let endOfPosts = useRef(false);
  const client = useApolloClient();
  let history = useHistory();

  setgqlQueryUserFollowedOrFollowingOrActivity(
    history.location.pathname,
    gqlQuery,
    FETCH_USER_FOLLOWERS,
    FETCH_FOLLOWED_USERS,
    FETCH_ALL_ACTIVITY
  )
  
  useEffect(() => {
    var scroll;
  
    if (history.location.pathname === '/followers') {
      scroll = infiniteScroll(
        client, updateCacheInfScrollUserFollowers,
        query, gqlQuery,
        cursorId, fetchMoreDiv,
        fetchMoreDivId
      )
    } else {
      scroll = infiniteScroll(
        client, updateCacheInfScrollFollowedUsers,
        query, gqlQuery,
        cursorId, fetchMoreDiv,
        fetchMoreDivId
      )
    }

    return () => {
      document.removeEventListener('scroll', scroll)
      timeAgoRef.current = []
      refetch()
    }

    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data, refetch } = useQuery(gqlQuery.current, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: null
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)

  const handleHeader = () => {
    if (history.location.pathname === '/followers') {
      return (
        <h1>Followers</h1>
      )
    } else if (history.location.pathname === '/following'){
      return (
        <h1>Following</h1>
      )
    } else {
      return (
        <h1>Activity</h1>
      )
    }
  }
  
  return(
    <div
      className='followContainer'
    >
        <div
          className='outerContainer'
        >

          {handleHeader()}

          <div
            className={
              history.location.pathname === '/activity' ?
              'activity' :
              'followFeedContainer'
            }
          >
            {feedArr.current.map((followOrActivity, i) => {
              if (history.location.pathname === '/activity') {
                return (
                  <div
                    key={followOrActivity._id}
                  >
                    {handleTimeAgo(followOrActivity, timeAgoRef)}
                    {handleActivity(followOrActivity)}
                  </div>
                )
              } else {
                var user = followOrActivity.hasOwnProperty('follows') ? 
                followOrActivity.follows : 
                followOrActivity.user
                return (
                  <div
                    key={user._id}
                    className='followResult'
                  >
                    <UserResult
                      user={user}
                    />
                  </div>
                )
              }
            })}
          </div>
          <div
            id='fetchMoreFollowers'
          >
          </div>
        </div>

        <CheckOutTheseBlogs />
    </div>
  )
}

export default UserFollowersOrFollowingFeed;