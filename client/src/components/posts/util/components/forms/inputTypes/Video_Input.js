import React, { useEffect } from 'react';

import ReactPlayer from 'react-player';

import PostFormUtil from '../../../functions/post_form_util.js'
const { previewVideoFile, previewVideoLink, 
        removeVideoObj } = PostFormUtil;

const VideoInput = ({
  displayBodyImageAndTextInput,
  setDisplayBodyImageAndTextInput,
  post,
  update,
  videoFile,
  setVideoFile,
  videoObj, 
  setVideoObj,
  objsToClean,
  active, 
  setActive,
  isLink, 
  setIsLink
}) => {

  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setVideoObj(videoObj = post.videoLink.url)
      //eslint-disable-next-line
      setActive(active = true)
    }
  }, [])

  useEffect(() => {
    if (
        Object.keys(videoFile).length !== 0 || 
        Object.keys(videoObj).length !== 0
      ) {

      //eslint-disable-next-line
      setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = true)
    }
  }, [videoFile, videoObj])

  useEffect(() => {
    if (update && videoObj) {
      var el = document.querySelector('.videoLinkInput')

      if (el) {
        el.value = ''
      }
    }
  }, [videoObj, update])

  const renderUpdateFileInput = () => {
    if (update) {
      return (
        <div
          className='videoFileInputContainer'
        >
          <label
            className='videoFileInputCustomLabel'
          >
          <div>
            <img 
              className='videoIcon'
              src="https://img.icons8.com/nolan/64/camcorder-pro.png"
              alt=''
            />
            <span>Upload a different video file</span>
          </div>
          <input
            id='videoFileInput'
            type='file'
            accept='video/*'
            onChange={e => {
              previewVideoFile(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active, 
                setActive,
                objsToClean
              )

              document.getElementById('videoFileInput').value = ''
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
            className='videoLinkInput'
            placeholder='Paste a new url'
            onChange={e => {
              previewVideoLink(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active, 
                setActive,
                objsToClean
              )

              setIsLink(isLink = true) 
            }}
          ></textarea>
          </div>
          <div className='borderMiddle' />
        </div>
      )
    }
  }

  if (active) {
    return (
      <div
        className='videoPlayerContainer'
      >
        <button
          className='removeBtn'
          type='button'
          onClick={() => {
              removeVideoObj(
              post,
              videoObj,
              setVideoObj,
              videoFile,
              setVideoFile,
              active,
              setActive,
              isLink,
              setIsLink,
              objsToClean
            )

            setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = false)
          }}
        >
          <span>x</span>
        </button>
        <ReactPlayer
          width={'100%'}
          url={videoObj}
          controls
        />
        {renderUpdateFileInput()}
      </div>
    )
  } else {
    return(
      <div
        className='videoFileInputContainer'
      >
        <label
          className='videoFileInputCustomLabel'
        >
          <div>
            <img 
              className='videoIcon'
              src="https://img.icons8.com/nolan/64/camcorder-pro.png"
              alt=''
            />
            <span>Upload a video file</span>
          </div>
          <input
            id='videoFileInput'
            type='file'
            accept='video/*'
            onChange={e => {
              previewVideoFile(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active, 
                setActive,
                objsToClean
              )

              document.getElementById('videoFileInput').value = ''
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
              previewVideoLink(
                e,
                post,
                videoObj,
                setVideoObj,
                videoFile,
                setVideoFile,
                active,
                setActive,
                objsToClean
              )

              setIsLink(isLink = true)
            }}
          ></textarea>
        </div>
        <div  className='borderMiddle' />
      </div>
    )
  }
}

export default VideoInput;