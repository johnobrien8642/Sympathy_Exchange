import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import PostShow from '../../../types/showOrUpdate/PostShow'
import ConfirmClose from '../../../../nav/Confirm_Close';
import DescriptionStringInput from '../forms/inputTypes/Description_String_Input';

import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
import PostFormUtil from '../../functions/post_form_util.js';
import UpdateCacheUtil from '../../functions/update_cache_util.js';
const { CREATE_REPOST, UPDATE_REPOST } = Mutations;
const { FETCH_USER_FEED } = Queries;
const { preventScroll, allowScroll } = PostFormUtil;
const { postCreate } = UpdateCacheUtil;

const RepostForm = ({
  post,
  show,
  repostActive,
  setRepostActive,
  update,
  setUpdate,
  uploading,
  setUploading
}) => {
  let [repostCaption, setRepostCaption] = useState('');
  // let repostTrail = useState([])
  let [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {

    if (repostActive) {
      preventScroll(repostActive, document)
    }

    return () => {
      allowScroll(document)
    }
  })
  
  let [repost] = useMutation(CREATE_REPOST, {
    update(client, { data }) {
      const { repost } = data;
      var createQuery = FETCH_USER_FEED

      postCreate(client, repost, Cookies.get('currentUser'), createQuery)
    },
    onCompleted(data) {
      resetInputs();
      setRepostActive(repostActive = false)
      setUploading(uploading = false)
    },
    onError(error) {
      console.log(error)
    }
  })
  
  let [updateRepost] = useMutation(UPDATE_REPOST, {
    update(client, { data }) {
      const { updateRepost } = data

      console.log(updateRepost)

    },
    onCompleted() {
      setUpdate(update = false)
    },
    onError(error) {
      console.log(error)
    }
  })
  
  const resetInputs = () => {
    setRepostCaption(repostCaption = '');
  }

  const handleSubmit = () => {
    var repostObj = {}

    if (post.kind === 'Repost') {
      repostObj.repostedId = post._id
      repostObj.postId = post.post._id
      repostObj.postKind = post.post.kind
      repostObj.postAuthor = post.post.user._id
    } else {
      repostObj.repostedId = post._id
      repostObj.postId = post._id
      repostObj.postKind = post.kind
      repostObj.postAuthor = post.user._id
    }

    if (update) {
      repostObj.captionId = post.repostTrail[post.repostTrail.length - 1]._id
      repostObj.update = true
    } else {
      repostObj.update = false
      repostObj.updatedRepostTrail = null
    }
    
    repostObj.previousReposter = post.kind === 'Repost' ? post.user : null
    repostObj.repostCaption = repostCaption
    repostObj.user = Cookies.get('currentUser')
    repostObj.repostedFrom = post.user.blogName

    if (update) {
      updateRepost({
        variables: {
          repostData: repostObj
        }
      })
    } else {
      repost({
        variables: {
          repostData: repostObj
        }
      })
    }
  }

  const handleRepostFormHeader = () => {
    if (!update) {
      return (
        <div
          className='userRepostFormHeader'
        >
          <span>
            <Link 
              className='user'
              to={`/view/blog/${Cookies.get('currentUser')}`}>
              {Cookies.get('currentUser')}
            </Link> 
            <img 
              src="https://img.icons8.com/material-two-tone/24/ffffff/retweet.png"
              alt=''
            />
            <Link
              className='repostedFrom'
              to={`/view/blog/${post.user.blogName}`}
            >
              {post.user.blogName}
            </Link>
          </span>
        </div>
      )
    }
  }
  
  const handleConfirmCloseForm = () => {
    if (!update) {
      return (
        <ConfirmClose
          update={update}
          setUpdate={setUpdate}
          confirmClose={confirmClose}
          setConfirmClose={setConfirmClose}
          allowScroll={allowScroll}
          resetInputs={resetInputs}
          setFormActive={setRepostActive}
          formActive={repostActive}
          repost={true}
        />
      )
    }
  }

  const handleConfirmCloseUpdate = () => {
    if (update) {
      return (
        <ConfirmClose
          update={update}
          setUpdate={setUpdate}
          confirmClose={confirmClose}
          setConfirmClose={setConfirmClose}
          allowScroll={allowScroll}
          resetInputs={resetInputs}
          setFormActive={setRepostActive}
          formActive={repostActive}
          repost={true}
        />
      )
    }
  }

  const handleCaptionInput = () => {
    if (!update) {
      return (
        <DescriptionStringInput
          repost={true}
          description={repostCaption}
          setDescription={setRepostCaption}
        />
      )
    }
  }

  const handleRepostModalClass = () => {
    if (uploading) {
      return 'repostModal hidden'
    } else if (update) {
      return 'repostModal none'
    } else {
      return 'repostModal'
    }
  }

  const handleRepostFormClass = () => {
    if (uploading) {
      return 'repostForm hidden'
    } else if (update) {
      return 'repostForm update'
    } else {
      return 'repostForm'
    }
  }

  if (repostActive || update) {
    return (
      <React.Fragment>
        <div 
          className={handleRepostModalClass()}
        >
          <div
            className={handleRepostFormClass()}
          >

            {handleRepostFormHeader()}

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit()
              }}
            >
            
              <PostShow
                post={post}
                repostFormBool={true}
                update={update}
                repostCaption={repostCaption}
                setRepostCaption={setRepostCaption}
              />

              {handleCaptionInput()}

              <div
                className='closeOrPostContainer'
              >
                <button
                  className='closeBtn'
                  type='button'
                  onClick={() => {
                    if (repostCaption || update) {
                      setConfirmClose(confirmClose = true)
                    } else {
                      setRepostActive(repostActive = false)
                    }
                  }} 
                >
                  Close
                </button>
              
                {handleConfirmCloseForm()}

                <button
                  className='formSubmitBtn'
                  type='submit'
                  onClick={() => {

                    if (!update) {
                      setUploading(uploading = true)
                    }
                  }}
                >
                  {update ? 'Update' : 'Repost'}
                </button>
              </div>
            </form>
          </div>
          {handleConfirmCloseUpdate()}
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default RepostForm;