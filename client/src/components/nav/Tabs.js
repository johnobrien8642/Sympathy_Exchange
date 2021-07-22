import React from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;

const Tabs = ({
  tab, 
  setTab,
  cursorId,
  timeAgoRef
}) => {

  let { loading, error, data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'User Fetch Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data;

  return(
    <React.Fragment>
      <div
        className='activityTabsHeader'
      >
        {user.blogName}
      </div>

      <div
        className='activityTabsDiv'
      >

        <div
        className={tab === 'all' ? 'tab activityTabSelected' : 'tab'}
        onClick={() => {
            timeAgoRef.current = []
            cursorId.current = new Date().getTime()
            setTab(tab = 'all')
          }}
        >
          <span>All</span>
        </div>

        <div
          className={tab === 'Mention' ? 'tab activityTabSelected' : 'tab'}
          onClick={() => {
            timeAgoRef.current = []
            cursorId.current = new Date().getTime()
            setTab(tab = 'Mention')
          }}
        >
          <span>Mentions</span>
        </div>

        <div
          className={tab === 'Repost' ? 'tab activityTabSelected' : 'tab'}
          onClick={() => {
            timeAgoRef.current = []
            cursorId.current = new Date().getTime()
            setTab(tab = 'Repost')
          }}
        >
          <span>Reblogs</span>
        </div>

        <div
          className={tab === 'Comment' ? 'tab activityTabSelected' : 'tab'}
          onClick={() => {
            timeAgoRef.current = []
            cursorId.current = new Date().getTime()
            setTab(tab = 'Comment')
          }}
        >
          <span>Replies</span>
        </div>
        
      </div>
    </React.Fragment>
  )
}

export default Tabs;