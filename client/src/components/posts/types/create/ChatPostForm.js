import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';

import ChatPostInput from '../../util/components/forms/inputTypes/Chat_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close.js';

import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import PostFormUtil from '../../util/functions/post_form_util.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx,
        handleMentions, discardMentions,
        handleAllTextChatPost, preventScroll,
        allowScroll, handleTagInput } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const ChatPostForm = ({
  mobile,
  user,
  post, 
  update,
  setUpdate,
  chatPostActive,
  setChatPostActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen,
  uploading,
  setUploading
}) => {
  let [chat, setChat] = useState('')

  let objsToClean = useRef([])
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  let [confirmClose, setConfirmClose] = useState(false);
  let history = useHistory();
  const formId = 'chatPostForm';
  const formInputId = 'chatPostInput';

  useEffect(() => {
  
    preventScroll(chatPostActive, document)

  }, [chatPostActive])

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
        setUploading(uploading = false)
      } else {
        allowScroll(document)
        setChatPostActive(chatPostActive = false)

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
    setChat(chat = '');
    setDescription(description = '');
    body.current = [];
    allText.current = '';
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var bodyImagesFormData = handleFormData(bodyImageFiles)

    Promise.all([
      bodyPost(bodyImagesFormData)
    ]).then(
      ([bodyUploads]) => {

        var mentions = handleMentions(body, stripAllImgs)
        
        discardMentions(post, mentions, objsToClean)
        
        var descriptions = stripAllImgs(body)

        handleAllTextChatPost(allText, descriptions, chat)
        
        var instanceData = {
          variants: { chat: chat },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'ChatPost',
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
    return !chat &&
    body.current.length === 0 &&
    !description
  }

  const handleChatPostFormClass = () => {
    if ((chatPostActive && !uploading) || update) {
      return 'postForm chatPostForm active'
    } else if (chatPostActive && uploading) {
      return 'postForm chatPostForm hidden'
    } else {
      return 'postForm chatPostForm none'
    }
  }
  
  if (chatPostActive || update) {
    return (
      <div
        className={update ? 'postFormContainer update' : 'postFormContainer'}
      >

      <ProfilePic user={update ? post.user : user} />

      <div
        className={handleChatPostFormClass()}
      >
        <form
          id={formId}
          onSubmit={e => handleSubmit(e)}
          onKeyPress={e => { e.key === 'Enter' && e.preventDefault() }}
          encType={'multipart/form-data'}
        >

        <h3
          className='userNameHeader'
        >{update ? post.user.blogName : user.blogName}</h3>
  
        <ChatPostInput
          chat={chat}
          setChat={setChat}
          post={post}
          update={update}
        />
  
        <BodyImageAndText
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
                    setPostFormModal(postFormModal = false)
                    setChatPostActive(chatPostActive = false)
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
            setFormActive={setChatPostActive}
            formActive={chatPostActive}
            setPostFormModal={setPostFormModal}
            postFormModal={postFormModal}
            postFormOpen={postFormOpen}
            setPostFormOpen={setPostFormOpen}
          />

          <button
            type='submit'
            className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
            disabled={disabledBool()}
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
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default ChatPostForm;