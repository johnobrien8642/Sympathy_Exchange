import React from 'react';

import AddPhotoDivOrPhotoInput from './Add_Photo_Div_Or_Photo_Input';

import PostFormUtil from '../../../functions/post_form_util.js'
const { previewProfilePic } = PostFormUtil;

const MainImageOrRegisterPhotoInput = ({
  register,
  previewProfilePicRef,
  profileImageFile,
  setProfileImageFile,
  main,
  mainImageFiles,
  setMainImageFiles,
  render, 
  setRender,
  errMessage, 
  setErrMessage
}) => {

  if (register) {
    return (
      <React.Fragment>
          <label
            className='profilePicFileInputCustomLabel'
          >
            <div>
              <img
                src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
                alt=''
              />
              <span>Upload a profile picture</span>
            </div>
            <input
              hidden
              id='profilePicFileInput'
              type='file'
              name='image'
              accept='.png, .jpg, jpeg'
              onChange={e => {
                previewProfilePic(
                  e,
                  previewProfilePicRef,
                  profileImageFile,
                  setProfileImageFile
                )
                  
                  document.querySelector('#profilePicFileInput').value = ''
                }}
            />
          </label>
          <p>{errMessage}</p>
      </React.Fragment>
    )
  } else {
    return (
      <AddPhotoDivOrPhotoInput
        showBtnBool={main.current.length > 0}
        main={main}
        mainImageFiles={mainImageFiles}
        setMainImageFiles={setMainImageFiles}
        render={render}
        setRender={setRender}
        errMessage={errMessage}
        setErrMessage={setErrMessage}
      />
    )
  }
}

export default MainImageOrRegisterPhotoInput;