import React from 'react'; 
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

import LikeButton from './Like_Button'

import Queries from '../../../../../graphql/queries';
import PostFormUtil from '../../functions/post_form_util.js';
const { DOES_USER_LIKE_POST } = Queries;
const { handlePostId, preventScroll } = PostFormUtil;

const PostOptions = ({ 
  post, 
  refetchNotes, 
  notesCount,
  notesActive, 
  setNotesActive, 
  toggleNotes,
  update,
  setUpdate,
  toggleUpdate,
  repostActive,
  setRepostActive,
  confirmDelete,
  setConfirmDelete
}) => {
  var postId = handlePostId(post);
  let location = useLocation();

  let { loading, error, data, refetch } = useQuery(DOES_USER_LIKE_POST,{
    variables: {
      user: Cookies.get('currentUser'),
      postId: postId
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`

  const { doesUserLikePost } = data;

  if (
      post.user.blogName === Cookies.get('currentUser') &&
      location.pathname !== '/discover'
    ) {
    return (
      <div
        className='postFooter'
      >
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(notesActive, setNotesActive)
          }}
        >
          {notesCount} notes
        </div>
        
        <div
          className='postOptions'
        >
          <img
            className='commentBubbleBtn'
            src="https://img.icons8.com/windows/64/000000/speech-bubble--v1.png"
            alt=''
            onClick={() => {
              toggleNotes()
            }}
          />

          <img 
            className='repostIcon'
            src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              setRepostActive(repostActive = true)
            }}
          />

          <LikeButton
            post={post}
            liked={doesUserLikePost}
            refetchDoesUserLikePost={refetch}
            refetchNotes={refetchNotes}
          />

          <img
            className='deletePostBtn'
            src="https://img.icons8.com/metro/64/000000/delete.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              setConfirmDelete(confirmDelete = true)
            }}
          />
          <img
            className='editPostBtn'
            src="https://img.icons8.com/windows/64/000000/edit--v1.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              toggleUpdate(update, setUpdate)
            }}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='postFooter'
      >
        <div
          className='notesBtn'
          onClick={() => {
            toggleNotes(notesActive, setNotesActive)
          }}
        >
          {notesCount} notes
        </div>
  
        <div
          className='postOptions'
        >
          <img
            className='commentBubbleBtn'
            src="https://img.icons8.com/windows/64/000000/speech-bubble--v1.png"
            alt=''
            onClick={() => {
              toggleNotes()
            }}
          />

          <img 
            className='repostIcon'
            src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
            alt=''
            onClick={() => {
              setNotesActive(notesActive = false)
              setRepostActive(repostActive = true)
            }}
          />
          
          <LikeButton
            post={post}
            liked={doesUserLikePost}
            refetchDoesUserLikePost={refetch}
          />
        </div>
      </div>
    )
  }
};

export default PostOptions;