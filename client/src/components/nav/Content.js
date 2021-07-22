import React, { useRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';

import FeedUtil from '../posts/util/functions/feed_util.js';
import ActivityUtil from '../nav/util/activity_util.js';
import Queries from '../../graphql/queries.js';
const { FETCH_ALL_ACTIVITY } = Queries;
const { handleActivity, handleTimeAgo } = ActivityUtil;
const { infiniteScroll, 
        updateCacheInfScrollActivity, 
        handleData } = FeedUtil;

const Content = ({
  tab, 
  active, 
  setActive,
  timeAgoRef
}) => {
  let feedArr = useRef([]);
  let fetchMoreDiv = useRef(null);
  let cursorId = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreActivity');
  let gqlQuery = useRef(FETCH_ALL_ACTIVITY)
  let query = useRef(Cookies.get('currentUser'));
  let endOfPosts = useRef(false);
  const client = useApolloClient();

  useEffect(() => {
    timeAgoRef.current = []

    document.querySelector('.activity').focus()
    
    var scroll = infiniteScroll(
      client, updateCacheInfScrollActivity,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )

    return () => {
      document.removeEventListener('scroll', scroll)
      refetch()
    }
    //eslint-disable-next-line
  }, [tab, active])
  
  let { loading, error, data, refetch } = useQuery(gqlQuery.current, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: null
    },
    fetchPolicy: 'no-cache'
  })

  if (loading) return 'Loading Content...';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)

  return(
    <div
      className='content'
    >
      {feedArr.current.map((activity, i) => {
        return (
          <div
            key={activity._id}
          >
            {handleTimeAgo(activity, timeAgoRef, tab)}
            {handleActivity(activity, tab, true, active, setActive)}
          </div>
        )
      })}

      <div
        id='fetchMoreActivity'
      >
      </div>
    </div>
  )
}

export default Content;