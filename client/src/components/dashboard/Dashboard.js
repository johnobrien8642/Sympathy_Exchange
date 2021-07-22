import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Route, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import PostsNav from '../nav/Posts_Nav';
import Feed from '../feeds/Feed.js';
import PostRadar from '../dashboard/util/Post_Radar';
import CheckOutTheseBlogs from '../dashboard/util/Check_Out_These_Blogs';
import RepostForm from '../posts/util/components/social/Repost_Form';

import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;

const Dashboard = props => {
  let [uploading, setUploading] = useState(false)
  let history = useHistory()
  
  let { loading, error, data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data;

  return(
    // <React.Fragment>
    <div
      className='dashboard'
    >
      <Route
        exact path={`${props.match.path}/repost/:blogName/:postId/:typename`}
        component={RepostForm}
      />
      <Route
        exact path={`${props.match.path}/create`}
        render={(props) => (
          <PostsNav
            props={props}
            mobile={true}
            user={user}
            uploading={uploading}
            setUploading={setUploading}
          />
        )}
      />
      
      <div
        className='column1'
      >
        <PostsNav 
          props={props}
          userLikes={history.location.pathname === '/likes' ? true : false}
          user={user}
          uploading={uploading}
          setUploading={setUploading}
        />
        <Feed 
          user={null}
          userLikes={history.location.pathname === '/likes' ? true : false}
          currentUser={user}
          uploading={uploading}
          setUploading={setUploading}
        />
      </div>

      <div
        className='column2'
      >
        <CheckOutTheseBlogs />
        <PostRadar />
      </div>
    {/* </React.Fragment> */}
    </div>
  )
}

export default Dashboard;