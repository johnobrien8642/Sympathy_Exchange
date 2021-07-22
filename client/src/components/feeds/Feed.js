import React, { useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { Link } from 'react-router-dom';
import PostUpdateOrShow from '../posts/types/showOrUpdate/PostUpdateOrShow';
import Cookies from 'js-cookie';
import Queries from '../../graphql/queries';
import FeedUtil from '../posts/util/functions/feed_util.js';
import ProfilePic from '../user/util/components/Profile_Pic';
import PostLoading from '../nav/Post_Loading';
import FollowButton from '../posts/util/components/social/Follow_Button';
import PostShowUtil from '../posts/util/functions/post_show_util.js';
const { FETCH_USER_FEED, FETCH_USER_BLOG_FEED, FETCH_TAG_FEED, FETCH_USER_LIKES } = Queries;
const { infiniteScroll, updateCacheInfScroll,
        handleData, setgqlQueryAndQueryFeed } = FeedUtil;
const { handlePostClassName } = PostShowUtil;

const Feed = ({
  user, 
  tag,
  userLikes,
  currentUser,
  uploading,
  setUploading
}) => {
  let feedArr = useRef([])
  let fetchMoreDiv = useRef(null);
  let fetchMoreDivId = useRef('#fetchMoreFeed');
  let cursorId = useRef(null);
  let query = useRef(Cookies.get('currentUser'))
  let gqlQuery = useRef(FETCH_USER_FEED)
  let endOfPosts = useRef(false)
  const client = useApolloClient();

  setgqlQueryAndQueryFeed(
    tag, 
    user, 
    userLikes, 
    gqlQuery, 
    query,
    FETCH_TAG_FEED,
    FETCH_USER_BLOG_FEED,
    FETCH_USER_LIKES,
    Cookies.get('currentUser')
  )
  
  useEffect(() => {
    
    var scroll = infiniteScroll(
      client, updateCacheInfScroll,
      query, gqlQuery,
      cursorId, fetchMoreDiv,
      fetchMoreDivId
    )
    
    return () => {
      document.removeEventListener('scroll', scroll)
    }
    //eslint-disable-next-line
  }, [])
  
  let { loading, error, data } = useQuery(gqlQuery.current, {
    variables: {
      query: query.current,
      cursorId: null
    },
  })

  if (loading) return '';
  if (error) return `Error: ${error}`;
  
  handleData(data, feedArr, cursorId, endOfPosts)

  var handleLikesHeader = () => {
    if (userLikes) {
      return (
        <div
          className='userLikesHeader'
        >
          <h1>Likes</h1>
          <span 
            className='totalLikeCount'
          >
            {`${currentUser.totalLikeCount} likes`}
          </span>
        </div>
      )
    }
  }
  
  return(
    <div
      className='userOrTagFeed'
    >

      {handleLikesHeader()}

      <PostLoading 
        uploading={uploading}
      />
      {feedArr.current.map((obj, i) => {
        if (obj.kind === 'Repost') {
          return (
            <div
              className={handlePostClassName(obj)}
              key={obj._id}
            >
              
              <div
                className='userRepostShowHeader'
              >
                <ProfilePic
                  user={obj.user}
                />
                <span
                  className='repostHeaderContainer'
                >
                  <Link 
                    className='user'
                    to={`/view/blog/${obj.user.blogName}`}>
                    {obj.user.blogName}
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
                      to={`/view/blog/${obj.repostedFrom.blogName}`}
                    >
                      {obj.repostedFrom.blogName}
                    </Link>
                    <FollowButton
                      feed={true}
                      user={obj.repostedFrom}
                    />
                  </div>
                </span>
              </div>
              
              <PostUpdateOrShow
                post={obj}
                repostFormBool={false}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          )
        } else {
          return (
            <div
              className={handlePostClassName(obj)}
              key={obj._id}
            >
              <PostUpdateOrShow
                post={obj}
                currentUser={currentUser}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          )
        }
      })}
      <div
        id='fetchMoreFeed'
      >
      </div>
    </div>
  )
}

export default Feed;