import React, { useState, useEffect } from 'react';

const PostLoading = ({
  uploading
}) => {
  let [toggle, setToggle] = useState(false)

  useEffect(() => {
    if (uploading) {
      var interval = setInterval(() => {
        //eslint-disable-next-line
        if (toggle) {
          //eslint-disable-next-line
          setToggle(toggle = false)
        } else {
          //eslint-disable-next-line
          setToggle(toggle = true)
        }
      }, 500)
    }

    return () => {
      clearInterval(interval)
    }
  }, [uploading])

  if (uploading) {
    return (
      <div
        className={toggle ? 'loading left' : 'loading right'}
      >
        <div
          className='loadingBarContainer'
        >
          <div className='bar1'/>
          <div className='bar2'/>
          <div className='bar3'/>
          <div className='bar4'/>
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

export default PostLoading;