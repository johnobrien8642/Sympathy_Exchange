import React, { useState } from 'react';

import PostFormUtil from '../../../functions/post_form_util.js'
const { previewMainImages, previewLink } = PostFormUtil;

const AddPhotoDivOrPhotoInput = ({
  showBtnBool,
  main,
  mainImageFiles,
  setMainImageFiles,
  render, 
  setRender,
  errMessage, 
  setErrMessage
}) => {
  let [active, setActive] = useState(false)

  if (showBtnBool && !active) {
    return (
      <div
        className='addPhotoBtn'
        onClick={() => {
          setActive(active = true)
        }}
      >
        <div>
          <img
            src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
            alt=''
          />
          <span>Add another</span>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='mainImageFileInputContainer'
      >
        <label
          className='mainImageFileInputCustomLabel'
        >
          <div>
            <img
              src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
              alt=''
            />
            <span>Upload a picture</span>
          </div>
          <input
            id='mainFileInput'
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              previewMainImages(
                e, main, mainImageFiles,
                setMainImageFiles,
                setErrMessage, errMessage,
              )
              
              document.querySelector('#mainFileInput').value = ''
              setActive(active = false)
            }}
          />
          </label>
          <div
            className='linkContainer'
          >
            <img
              className='linkIcon'
              src="https://img.icons8.com/flat-round/64/000000/link--v1.png"
              alt=''
            />
            <textarea
              placeholder='Paste a url...'
              onChange={e => {
                var newLinkObj = previewLink(e)
                if (newLinkObj) {
                  main.current.push(newLinkObj)
                  e.target.value = ''
                  setActive(active = false)
                  setRender(render + 1)
                }
              }}
            ></textarea>
          </div>
          <div  className='borderMiddle' />
          <p>{errMessage}</p>
          <div
            className='backBtnContainer'
          >
            <img
              className={main.current.length === 0 ? 'backBtn' : 'backBtn active'}
              src="https://img.icons8.com/windows/64/000000/long-arrow-left.png"
              alt=''
              onClick={() => {
                setActive(active = false)
              }}
            />
          </div>
      </div>
    )
  }
}

export default AddPhotoDivOrPhotoInput;