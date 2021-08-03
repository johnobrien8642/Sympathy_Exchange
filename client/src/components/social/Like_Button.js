import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
import UpdateCacheUtil from '../../functions/update_cache_util.js';
const { LIKE_POST, UNLIKE_POST } = Mutations;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;
const { postLike, postUnlike } = UpdateCacheUtil;

const LikeButton = ({ 
  post, liked, 
  refetchDoesUserLikePost
}) => {
  var initial = liked ? true : false

  let [status, setStatus] = useState(initial)

  useEffect(() => {
    refetchDoesUserLikePost()
  })

  let [likePost] = useMutation(LIKE_POST, {
    update(client, { data }) {
      const { likePost } = data,
      query = FETCH_LIKES_REPOSTS_AND_COMMENTS

      postLike(
        client, likePost,
        post, query
      )
    }
  })

  let [unlikePost] = useMutation(UNLIKE_POST, {
    update(client, { data }) {
      const { unlikePost } = data,
      query = FETCH_LIKES_REPOSTS_AND_COMMENTS

      postUnlike(
        client, unlikePost,
        post, liked, query
      )
    }
  })
  
  if (status) {
    return (
      <img
        className='likeBtn'
        src="https://img.icons8.com/material-rounded/64/000000/like--v1.png"
        alt=''
        onClick={() => {
          unlikePost({
            variables: {
              likeId: liked._id,
              postId: post._id
            }
          })
          setStatus(status = false)
        }}
      />
    )
  } else {
    return (
      <img
        className='likeBtn'
        src="https://img.icons8.com/material-outlined/64/000000/like--v1.png"
        alt=''
        onClick={() => {
          likePost({
            variables: {
              postId: post._id,
              user: Cookies.get('currentUser'),
              postKind: post.kind
            }
          })
          setStatus(status = true)
        }}
      />
    )
  }
}

export default LikeButton;