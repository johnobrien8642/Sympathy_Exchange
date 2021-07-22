import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';

import VideoInput from '../../util/components/forms/inputTypes/Video_Input';
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text';
import Tags from '../../util/components/forms/Tags';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close';

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
import PostFormUtil from '../../util/functions/post_form_util.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, videoPost, handleFormData, 
        stripAllImgs, handleUploadedFiles, 
        resetDisplayIdx, handleMentions, 
        discardMentions, handleAllTextVideoPost,
        allowScroll, preventScroll, handleTagInput  } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const VideoPostForm = ({
  mobile,
  user,
  post, 
  update,
  setUpdate,
  videoPostActive,
  setVideoPostActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen,
  uploading,
  setUploading
}) => {
  let [videoFile, setVideoFile] = useState('');
  let [videoObj, setVideoObj] = useState('');
  let [isLink, setIsLink] = useState(false)
  
  let [active, setActive] = useState(false)
  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  let [confirmClose, setConfirmClose] = useState(false);
  let [displayBodyImageAndTextInput, setDisplayBodyImageAndTextInput] = useState(false);
  let history = useHistory();
  const formId = 'videoPostForm';
  const formInputId = 'videoPostInput'

  useEffect(() => {

    preventScroll(videoPostActive, document)

  }, [videoPostActive])

  useEffect(() => {
    resetDisplayIdx(body)
  })

  let [createOrUpdatePost] = useMutation(CREATE_OR_UPDATE_POST, {
    update(client, { data }){
      const { createOrUpdatePost } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER_FEED
      
      if (post) {
        postUpdate(client, createOrUpdatePost, currentUser, query)
      } else {
        postCreate(client, createOrUpdatePost, currentUser, query)
      }
    },
    onCompleted() {
      resetInputs();
      if (post) {
        setUpdate(update = false)
      } else {
        resetInputs()
        allowScroll(document)
        setVideoPostActive(videoPostActive = false)
        
        if (mobile) {
          setPostFormOpen(postFormOpen = false)
          history.push('/dashboard')
        }

        setUploading(uploading = false)
      }
    },
    onError(error) {
      console.log(error)
    }
  });

  const resetInputs = () => {
    setVideoObj(videoObj = '');
    setVideoFile(videoFile = '');
    setActive(active = false);
    setUploading(uploading = false);
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    allText.current = '';
    setDescription(description = '');
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (videoFile) {
      var videoFileFormData = new FormData();
      videoFileFormData.append('video', videoFile)
    }

    var bodyImagesFormData = handleFormData(bodyImageFiles)

    Promise.all([
      bodyPost(bodyImagesFormData),
      videoPost(videoFileFormData, isLink, videoObj)
    ]).then(
      ([bodyUploads, video]) => {

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)

        var descriptions = stripAllImgs(body)

        handleAllTextVideoPost(allText, descriptions)

        var instanceData = {
          variants: {
            videoLink: video[0]._id
          },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'VideoPost',
          objsToClean: objsToClean.current,
          postId: post ? post._id : null
        };
        
        createOrUpdatePost({
          variables: {
            instanceData: instanceData
          }
        })
      }
    )
  }

  const disabledBool = () => {
    return !videoFile && 
    !videoObj &&
    !uploading &&
    body.current.length === 0 &&
    !description
  }

  const handleVideoPostFormClass = () => {
    if ((videoPostActive && !uploading) || update) {
      return 'postForm videoPostForm active'
    } else if (videoPostActive && uploading) {
      return 'postForm videoPostForm hidden'
    } else {
      return 'postForm videoPostForm none'
    }
  }

  if (videoPostActive || update) {
    return (
    <div
      className={update ? 'postFormContainer update' : 'postFormContainer'}
    >

      <ProfilePic user={update ? post.user : user} />

      <div>
        <div
          className={handleVideoPostFormClass()}
        >
          
          <h3
            className='userNameHeader'
          >{update ? post.user.blogName : user.blogName}</h3>

          <form
            id={formId}
            onSubmit={e => {
              setUploading(uploading = true)
              handleSubmit(e)
            }}
            onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
            encType={'multipart/form-data'}
          >

          <p>{uploading ? 'Uploading, please wait...': ''}</p>
          
          <VideoInput
            displayBodyImageAndTextInput={displayBodyImageAndTextInput}
            setDisplayBodyImageAndTextInput={setDisplayBodyImageAndTextInput}
            post={post}
            update={update}
            formId={formId}
            active={active}
            objsToClean={objsToClean}
            setActive={setActive}
            videoObj={videoObj}
            setVideoObj={setVideoObj}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            isLink={isLink}
            setIsLink={setIsLink}
          />

          <BodyImageAndText
            displayBodyImageAndTextInput={displayBodyImageAndTextInput}
            post={post}
            update={update}
            formId={formId}
            formInputId={formInputId}
            objsToClean={objsToClean}
            body={body}
            bodyImageFiles={bodyImageFiles}
            setBodyImageFiles={setBodyImageFiles}
            description={description}
            setDescription={setDescription}
            render={render}
            setRender={setRender}
            errMessage={errMessage}
            setErrMessage={setErrMessage}
          />

          <Tags
            post={post}
            tag={tag}
            setTag={setTag}
            tags={tags}
            setTags={setTags}
          />

          <div
            className='closeOrPostContainer'
          >
            <div
              className='closeBtn'
              onClick={() => {
                if (disabledBool()) {
                    resetInputs()
                    allowScroll(document)
                    
                    if (!update) {
                      setVideoPostActive(videoPostActive = false)
                      setPostFormModal(postFormModal = false)
                    } else {
                      setUpdate(update = false)
                    }

                    if (mobile) {
                      setPostFormOpen(postFormOpen = false)
                    }
                  } else {
                    setConfirmClose(confirmClose = true)
                  }
              }}
            >
              Close
            </div>

            <ConfirmClose
              mobile={mobile}
              update={update}
              setUpdate={setUpdate}
              confirmClose={confirmClose}
              setConfirmClose={setConfirmClose}
              allowScroll={allowScroll}
              resetInputs={resetInputs}
              setFormActive={setVideoPostActive}
              formActive={videoPostActive}
              setPostFormModal={setPostFormModal}
              postFormModal={postFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
            />

            <button
              type='submit'
              disabled={disabledBool()}
              className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
              onClick={() => {
                if (description) {
                  var textObj = {
                    kind: 'text',
                    srcType: 'text',
                    content: description,
                    displayIdx: body.current.length,
                    uniqId: randomstring.generate({
                      length: 12,
                      charset: 'alphabetic'
                    })
                  }
  
                  body.current.push(textObj)
                
                  setDescription(description = '')
                }
                
                if (tag) {
                  handleTagInput(
                    tag, setTag,
                    tags, setTags
                  )
                }
                
                if (!update) {
                  setPostFormModal(postFormModal = false)
                }

                setUploading(uploading = true)
              }}
            >
              {post ? 'Update' : 'Post'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default VideoPostForm;