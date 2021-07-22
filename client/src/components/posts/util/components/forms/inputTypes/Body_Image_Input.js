import React, { useState } from 'react';

import PostFormUtil from '../../../functions/post_form_util.js'
const { previewBodyImages, previewLink } = PostFormUtil;

const BodyImageInput = ({
  body, 
  bodyImageFiles,
  setBodyImageFiles,
  render, 
  setRender,
  errMessage, 
  setErrMessage
}) => {
  let [active, setActive] = useState(false)
  
  if (active) {
    return (
      <React.Fragment>
        <div
          className='bodyImageInputContainer'
        >
        <div>
          <label
            className='bodyImageInputCustomLabel'
          >
            <span>Upload a picture</span>
            <input
              id='bodyFileInput'
              tabIndex={-1}
              type='file'
              multiple
              name='image'
              accept='.png, .jpg, jpeg'
              onChange={e => {
                previewBodyImages(
                  e, body, bodyImageFiles,
                  setBodyImageFiles,
                  setErrMessage, errMessage,
                )
                
                document.querySelector('#bodyFileInput').value = ''
                setActive(active = false)
              }}
            />
          </label>
          <textarea
            tabIndex={-1}
            placeholder='Paste a url...'
            onChange={e => {
              var newLinkObj = previewLink(e)
              if (newLinkObj) {
                body.current.push(newLinkObj)
                setRender(render + 1)
                e.target.value = ''
                setActive(active = false)
              }
            }}
          ></textarea>
          <p>{errMessage}</p>
        </div>
          <img
            className='backBtn'
            src="https://img.icons8.com/windows/64/000000/long-arrow-left.png"
            alt=''
            onClick={() => {
              setActive(active = false)
            }}
          />
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <img
        className='photoInputIcon'
        src="https://img.icons8.com/fluent/64/000000/old-time-camera.png"
        alt=''
        onClick={() => {
          setActive(active = true)
        }}
      />
    )
  }
}

export default BodyImageInput;