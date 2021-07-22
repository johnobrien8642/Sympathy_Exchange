import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';

import QuotePostInput from '../../util/components/forms/inputTypes/Quote_Post_Input'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import PostFormUtil from '../../util/functions/post_form_util.js'
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close.js';

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx,
        handleMentions, discardMentions,
        handleAllTextQuotePost, preventScroll,
        allowScroll, handleTagInput } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;

const QuotePostForm = ({
  mobile,
  user,
  post, 
  update,
  setUpdate,
  quotePostActive,
  setQuotePostActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen,
  uploading,
  setUploading
}) => {
  let [quote, setQuote] = useState('');
  let [source, setSource] = useState('');
  let [placeholder, setPlaceholder] = useState('Quote');

  let objsToClean = useRef([]);
  let [description, setDescription] = useState('');
  let [bodyImageFiles, setBodyImageFiles] = useState([]);
  let body = useRef([]);
  let allText = useRef('');
  let bodyImages = useRef([]);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let [errMessage, setErrMessage] = useState('');
  let [render, setRender] = useState(0);
  let [confirmClose, setConfirmClose] = useState(false)
  let history = useHistory();
  let formId = 'quotePostForm';
  const formInputId = 'quotePostInput';
  
  useEffect(() => {

    preventScroll(quotePostActive, document)

  }, [quotePostActive])

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
        setUploading(uploading = false)
        setQuotePostActive(quotePostActive = false)

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
    setQuote(quote = '');
    setSource(source = '');
    setBodyImageFiles(bodyImageFiles = []);
    bodyImages.current = [];
    body.current = [];
    allText.current = '';
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

        handleAllTextQuotePost(allText, descriptions, quote, source)
        
        var instanceData = {
          variants: { quote, source },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'QuotePost',
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
    return !quote && 
    !source &&
    body.current.length === 0 && 
    !description
  }

  const handleQuotePostFormClass = () => {
    if ((quotePostActive && !uploading) || update) {
      return 'postForm quotePostForm active'
    } else if ((quotePostActive && uploading) || uploading) {
      return 'postForm quotePostForm hidden'
    } else {
      return 'postForm quotePostForm none'
    }
  }

  if (quotePostActive || update) {
    return (
      <div
        className={update ? 'postFormContainer update' : 'postFormContainer'}
      >

      <ProfilePic user={update ? post.user : user} />
        
      <div
        className={handleQuotePostFormClass()}
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
  
        <QuotePostInput
          post={post}
          update={update}
          quote={quote}
          setQuote={setQuote}
          source={source}
          setSource={setSource}
          placeholder={placeholder}
          setPlaceholder={setPlaceholder}
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
                  allowScroll(document)
                  resetInputs()
                  
                  if (!update) {
                    setQuotePostActive(quotePostActive = false)
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
            setFormActive={setQuotePostActive}
            formActive={quotePostActive}
            setPostFormModal={setPostFormModal}
            postFormModal={postFormModal}
            postFormOpen={postFormOpen}
            setPostFormOpen={setPostFormOpen}
          />

          <button
            className={disabledBool() ? 'formSubmitBtn disabled' : 'formSubmitBtn'}
            type='submit'
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

export default QuotePostForm;