import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow'
import ProfilePic from '../user/util/components/Profile_Pic';
import PostLoading from '../nav/Post_Loading';
import FollowButton from '../posts/util/components/social/Follow_Button';

import Queries from '../../graphql/queries.js';
import PostShowUtil from '../posts/util/functions/post_show_util.js';
const { FETCH_POST } = Queries;
const { handlePostClassName } = PostShowUtil;


const UserPostShow = () => {
  let [uploading, setUploading] = useState(false)
  let { postId } = useParams();

  let { loading, error, data, } = useQuery(FETCH_POST, {
    variables: {
      query: postId
    }
  })

  if (loading) return 'Loading...'
  if (error) return `Error: ${error}`;

  if (data) {
    const { post } = data;
  
    if (uploading) {
      return (
        <PostLoading uploading={uploading} />
      )
    } else {
      if (post.kind === 'Repost') {
        return (
          <div
            className='postShow'
          >

          <Link
            className='backBtn'
            to='/dashboard'
          >
            Back
          </Link>

          <div
            className={handlePostClassName(post)}
            key={post._id}
          >
            
            <div
              className='userRepostShowHeader'
            >
              <ProfilePic
                user={post.post.user}
              />
              <span
                className='repostHeaderContainer'
              >
                <Link 
                  className='user'
                  to={`/view/blog/${post.user.blogName}`}>
                  {post.user.blogName}
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
                    to={`/view/blog/${post.repostedFrom.blogName}`}
                  >
                    {post.user.blogName}
                  </Link>
                  <FollowButton
                    feed={true}
                    user={post.repostedFrom}
                  />
                </div>
              </span>
            </div>
    
            <PostUpdateOrShow
              post={post}
              repostFormBool={false}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>
        </div>
        )
      } else {
        return (
          <div
            className='postShow'
          >

            <Link
              to='/dashboard'
            >
              Back
            </Link>
            
            <div
              className={handlePostClassName(post)}
              key={post._id}
            >
              <PostUpdateOrShow
                post={post}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          </div>
        )
      }
    }
  }
}

export default UserPostShow;