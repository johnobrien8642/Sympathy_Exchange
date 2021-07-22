import React, { useEffect } from 'react';

import MainImageDnD from '../dragAndDrop/Main_Image_DnD';
import MainImageOrRegisterPhotoInput from './Main_Image_Or_Register_Photo_Input';

import PostFormUtil from '../../../functions/post_form_util.js';
import PostUpdateUtil from '../../../functions/post_update_util.js';
const { reassemblePhotoPostMain } = PostUpdateUtil;
const { removeProfilePic } = PostFormUtil;

const PhotoPostOrRegisterInput = ({
  edit,
  register,
  previewProfilePicRef,
  profileImageFile,
  setProfileImageFile,
  post,
  formId, 
  main,
  mainImageFiles,
  setMainImageFiles,
  render, 
  setRender,
  objsToClean,
  errMessage,
  setErrMessage
}) => {

  useEffect(() => {
    if (post) {
      reassemblePhotoPostMain(main, post.mainImages)
      setRender(render + 1)
    }
    //eslint-disable-next-line
  }, [])

  const renderRemoveBtn = (
    previewProfilePicRef,
    profileImageFile, 
    setProfileImageFile,
    edit,
    render,
    setRender
  ) => {
    if (Object.keys(previewProfilePicRef.current).length > 0) {
      return (
        <button
          className='removeProPicBtn'
          type='button'
          onClick={() => {
            removeProfilePic(
              previewProfilePicRef,
              profileImageFile,
              setProfileImageFile,
              edit, render,
              setRender
            )
          }}
        >
          X
        </button>
      )
    }
  }

  const renderPhotoInput = (
    register,
    previewProfilePicRef,
    profileImageFile,
    setProfileImageFile
  ) => {
    if (Object.keys(previewProfilePicRef.current).length === 0) {
      return (
        <MainImageOrRegisterPhotoInput
          register={register}
          previewProfilePicRef={previewProfilePicRef}
          profileImageFile={profileImageFile}
          setProfileImageFile={setProfileImageFile}
        />
      )
    }
  }

  const renderPhotoPreview = (
    previewProfilePicRef,
    profileImageFile,
    setProfileImageFile,
    edit,
    render,
    setRender,
    renderRemoveBtn
  ) => {
    if (Object.keys(previewProfilePicRef.current).length > 0) {
      return (
        <div
          className='previewImg'
        >
          {renderRemoveBtn(
            previewProfilePicRef,
            profileImageFile,
            setProfileImageFile,
            edit, render,
            setRender
          )}
          <img 
            src={previewProfilePicRef.current.src}
            alt={previewProfilePicRef.current.alt}
          />
        </div>
      )
    }
  }
 
  if (register) {
    return (
      <div
        className='profilePicPreview'
      >
        {renderPhotoPreview(
          previewProfilePicRef,
          profileImageFile,
          setProfileImageFile,
          edit,
          render,
          setRender,
          renderRemoveBtn,
        )}    
    
        {renderPhotoInput(
          register,
          previewProfilePicRef,
          profileImageFile,
          setProfileImageFile
        )}
      </div>
    )
  } else {
    return (
      <div
        className='mainPreview'
      >
        {main.current.map((obj, i) => {
        return (
          <React.Fragment
            key={i}
          >
            <MainImageDnD 
              mainIdx={i}
              img={obj}
              main={main}
              mainImageFiles={mainImageFiles}
              setMainImageFiles={setMainImageFiles}
              objsToClean={objsToClean}
              render={render}
              setRender={setRender}
            />
          </React.Fragment>
          )
        })}
  
        <MainImageOrRegisterPhotoInput
          formId={formId}
          main={main}
          mainImageFiles={mainImageFiles}
          setMainImageFiles={setMainImageFiles}
          render={render}
          setRender={setRender}
          errMessage={errMessage}
          setErrMessage={setErrMessage}
        />
      </div>
    )
  }
}

export default PhotoPostOrRegisterInput;