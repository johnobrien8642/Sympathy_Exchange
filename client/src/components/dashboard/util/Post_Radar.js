import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import PostShow from '../../posts/types/showOrUpdate/PostShow';
import ProfilePic from '../../user/util/components/Profile_Pic';
import FollowButton from '../../posts/util/components/social/Follow_Button';

import Queries from '../../../graphql/queries.js';
import PostShowUtil from '../../posts/util/functions/post_show_util.js';
const { FETCH_POST_RADAR } = Queries;
const { handlePostClassName } = PostShowUtil

const PostRadar = () => {

  let { loading, error, data } = useQuery(FETCH_POST_RADAR, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchPostRadar } = data;

  if (fetchPostRadar) {
    if (fetchPostRadar.kind === 'Repost') {
      return (
        <div
          className='postRadar'
        >
          <h1 className='radarHeader'>Radar</h1>
          <div
            className={handlePostClassName(fetchPostRadar)}
          >
  
          <div
            className='userRepostShowHeader'
          >
            <ProfilePic
              user={fetchPostRadar.post.user}
            />
            <span
              className='repostHeaderContainer'
            >
              <Link 
                className='user'
                to={`/view/blog/${fetchPostRadar.user.blogName}`}>
                {fetchPostRadar.user.blogName}
              </Link>
              <div
                className='iconRepostedAndFollowContainer'
              >
                <img
                  src="https://img.icons8.com/material-two-tone/24/ffffff/retweet.png"
                  alt=''
                />
                <Link
                  className='repostedFrom'
                  to={`/view/blog/${fetchPostRadar.repostedFrom.blogName}`}
                >
                  {fetchPostRadar.repostedFrom.blogName}
                </Link>
                <FollowButton
                  feed={true}
                  user={fetchPostRadar.repostedFrom}
                />
              </div>
            </span>
          </div>
            <PostShow
              feedOrRadar={true}
              post={fetchPostRadar}
              radar={true}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div
          className='postRadar'
        >
          <h1 className='radarHeader'>Radar</h1>
          <div
            className={handlePostClassName(fetchPostRadar)}
          >
            <PostShow
              feedOrRadar={true}
              post={fetchPostRadar}
              radar={true}
            />
          </div>
        </div>
      )
    }
  } else {
    return (
      <div
        className='postRadar'
      >
        <h1 className='radarHeader'>Radar</h1>
      </div>
    )
  }
}

export default PostRadar;