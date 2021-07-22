import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomstring from 'randomstring';

import LinkPreview from '../../util/components/forms/Link_Preview'
import BodyImageAndText from '../../util/components/forms/Body_Image_And_Text'
import Tags from '../../util/components/forms/Tags'
import ProfilePic from '../../../user/util/components/Profile_Pic';
import ConfirmClose from '../../../nav/Confirm_Close';

import Mutations from '../../../../graphql/mutations.js';
import Queries from '../../../../graphql/queries.js';
import PostFormUtil from '../../util/functions/post_form_util.js'
import UpdateCacheUtil from '../../util/functions/update_cache_util.js';
const { postCreate, postUpdate } = UpdateCacheUtil;
const { bodyPost, handleFormData, stripAllImgs,
        handleUploadedFiles, resetDisplayIdx, 
        fetchUrlMetadata, handleMentions, 
        discardMentions, handleAllTextLinkPost,
        preventScroll, allowScroll, handleTagInput } = PostFormUtil;
const { CREATE_OR_UPDATE_POST } = Mutations;
const { FETCH_USER_FEED } = Queries;


const LinkPostForm = ({
  mobile,
  user,
  post, 
  update,
  setUpdate,
  linkPostActive,
  setLinkPostActive,
  postFormModal,
  setPostFormModal,
  postFormOpen,
  setPostFormOpen,
  uploading,
  setUploading
}) => {
  let [link, setLink] = useState('');
  let [pastLink, setPastLink] = useState('')
  let [siteName, setSiteName] = useState('');
  let [imageUrl, setImageUrl] = useState('');
  let [title, setTitle] = useState('');
  let [linkDescription, setLinkDescription] = useState('');
  let [result, setResult] = useState('');

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
  const formId = 'linkPostForm';
  const formInputId = 'linkPostInput';
  
  useEffect(() => {
    
    preventScroll(linkPostActive, document)

  }, [linkPostActive])

  useEffect(() => {
    resetDisplayIdx(body)
  })

  let [createOrUpdatePost] = useMutation(CREATE_OR_UPDATE_POST, {
    update(client, { data }) {
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
        setLinkPostActive(linkPostActive = false)
        
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
    setLink(link = '');
    setPastLink(pastLink = '');
    setResult(result = '');
    setTitle(title = '');
    setSiteName(siteName = '');
    setImageUrl(imageUrl = '');
    setLinkDescription(linkDescription = '');
    setBodyImageFiles(bodyImageFiles = []);
    body.current = [];
    allText.current = '';
    setTag(tag = '');
    setTags(tags = []);
    setErrMessage(errMessage = '');
    setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = false)
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
        
        var linkObj = {
          link, siteName, imageUrl,
          title, linkDescription
        }

        handleAllTextLinkPost(allText, descriptions, linkObj)
          
        var instanceData = {
          variants: {
            linkObj: linkObj
          },
          allText: allText.current,
          descriptions: descriptions,
          descriptionImages: handleUploadedFiles(body, bodyUploads),
          mentions: mentions,
          user: Cookies.get('currentUser'),
          tags, kind: 'LinkPost',
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
  
  const handleLinkPreview = () => {
    if (link !== pastLink && link !== '') {
      setPastLink(pastLink = link)
      fetchUrlMetadata(link).then(res => {
        if (res.data.success === true) {
          if (res.data.hasOwnProperty('ogImage')) {
            setSiteName(siteName = res.data.ogSiteName || '')
            setImageUrl(imageUrl = res.data.ogImage.url)
            setTitle(title = res.data.ogTitle)
            setLinkDescription(linkDescription = res.data.ogDescription)
            setResult(result = res)
          } else {
            setSiteName(siteName = res.data.ogSiteName || '')
            setImageUrl(imageUrl = '')
            setTitle(title = res.data.ogTitle)
            setLinkDescription(linkDescription = res.data.ogDescription)
            setResult(result = res)
          }
        }
      })
    }
  }

  const resetLink = () => {
    setLink(link = '')
    setPastLink(pastLink = '')
    setResult(result = '')
    setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = false)
  }

  const disabledBool = () => {
    return !link && 
    body.current.length === 0 && 
    !description
  }

  const handleLinkPostFormClass = () => {
    if ((linkPostActive && !uploading) || update) {
      return 'postForm linkPostForm active'
    } else if ((linkPostActive && uploading) || uploading) {
      return 'postForm linkPostForm hidden'
    } else {
      return 'postForm linkPostForm none'
    }
  }
  
  if (linkPostActive || update) {
    return (
      <div
        className={update ? 'postFormContainer update' : 'postFormContainer'}
      >

      <ProfilePic user={update ? post.user : user} />

      <div
        className={handleLinkPostFormClass()}
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
  
        {handleLinkPreview()}
        
        <LinkPreview
          displayBodyImageAndTextInput={displayBodyImageAndTextInput}
          setDisplayBodyImageAndTextInput={setDisplayBodyImageAndTextInput}
          post={post}
          update={update}
          link={link}
          setLink={setLink}
          pastLink={pastLink}
          setPastLink={setPastLink}
          result={result}
          siteName={siteName}
          setSiteName={setSiteName}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          title={title}
          setTitle={setTitle}
          linkDescription={linkDescription}
          setLinkDescription={setLinkDescription}
          resetLink={resetLink}
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
                  setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = false)
                  
                  if (!update) {
                    setLinkPostActive(linkPostActive = false)
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
            setFormActive={setLinkPostActive}
            formActive={linkPostActive}
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

export default LinkPostForm;