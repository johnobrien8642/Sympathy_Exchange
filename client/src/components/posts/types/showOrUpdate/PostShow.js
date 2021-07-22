import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import PostNotes from '../../util/components/social/Post_Notes.js';
import PostOptions from '../../util/components/social/Post_Options.js';
import RepostForm from '../../util/components/social/Repost_Form';

import PostShowUtil from '../../util/functions/post_show_util.js';
import Queries from '../../../../graphql/queries';
import Mutations from '../../../../graphql/mutations';
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
const { postHeader, postBody, repostFooter, postTags } = PostShowUtil;
const { allowScroll, preventScroll } = PostFormUtil;
const { postDelete } = UpdateCacheUtil;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS, FETCH_USER_FEED } = Queries;
const { DELETE_POST } = Mutations;


const PostShow = ({ 
  post, 
  repostFormBool,
  update, 
  setUpdate,
  toggleUpdate,
  discover, 
  radar,
  repostCaption,
  setRepostCaption,
  uploading,
  setUploading
}) => {
  let [notesActive, setNotesActive] = useState(false)
  let [repostActive, setRepostActive] = useState(false)
  let [confirmDelete, setConfirmDelete] = useState(false)
  let doesUserFollowUserRef = useRef(false)

  useEffect(() => {
    if (confirmDelete) {

      preventScroll(confirmDelete, document)

    }
    
  }, [confirmDelete])

  let [deletePost] = useMutation(DELETE_POST, {
    update(client, { data }) {
      const { deletePost } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED
    
      postDelete(
        client, post, deletePost,
        currentUser, query
      )
    }
  })

  let { loading, error, data } = useQuery(FETCH_LIKES_REPOSTS_AND_COMMENTS, {
    variables: {
      postId: post._id
    }
  })

  const toggleNotes = () => {
    if (notesActive) {
      setNotesActive(notesActive = false)
    } else {
      setNotesActive(notesActive = true)
    }
  }

  const notesAndOptions = () => {
    if (!repostFormBool) {
      return (
        <React.Fragment>
          <PostNotes
            post={post}
            notesCount={data.fetchLikesRepostsAndComments.length}
            notes={data.fetchLikesRepostsAndComments}
            notesActive={notesActive}
            setNotesActive={setNotesActive}
          />
      
          <PostOptions
            post={post}
            notesCount={data.fetchLikesRepostsAndComments.length}
            notesActive={notesActive}
            setNotesActive={setNotesActive}
            toggleNotes={toggleNotes}
            update={update}
            setUpdate={setUpdate}
            toggleUpdate={toggleUpdate}
            repostActive={repostActive}
            setRepostActive={setRepostActive}
            confirmDelete={confirmDelete}
            setConfirmDelete={setConfirmDelete}
          />
        </React.Fragment>
      )
    }
  }

  const renderConfirmDelete = () => {
    if (confirmDelete) {
      return (
        <React.Fragment>
          <div className='confirmDeleteModal' />
          <div
            className='confirmDelete'
          >
            <p>Are you sure you want to delete this post?</p>

            <div>
              <button
                className='cancelBtn'
                onClick={() => {
                  allowScroll(document)
                  setConfirmDelete(confirmDelete = false)
                }}
              >
                Cancel
              </button>

              <button
                className='deleteBtn'
                onClick={e => {
                  allowScroll(document)
                  deletePost({
                    variables: {
                      post: post
                    }
                  })
                  setConfirmDelete(confirmDelete = false)
                }}
              >
                Ok
              </button> 
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`
  
  switch(post) {
    case null:
      return (
        <div>
          <p>Sorry, looks like this post no longer exists</p>
        </div>
      )
    default:
      return (
        <React.Fragment>
            {postHeader(post, discover, radar, doesUserFollowUserRef, repostFormBool)}
        
            {postBody(post)}
        
            {repostFooter(post, update, repostCaption, setRepostCaption)}
        
            {postTags(post)}

            {notesAndOptions()}

            {renderConfirmDelete()}

            <RepostForm
              post={post}
              repostActive={repostActive}
              setRepostActive={setRepostActive}
              uploading={uploading}
              setUploading={setUploading}
            />
        </React.Fragment>
      )
  }
}

export default PostShow;