import React, { useEffect } from 'react';

import MainImageDnD from '../../forms/dragAndDrop/Main_Image_DnD'
import MainImageInput from './Main_Image_Or_Register_Photo_Input'

import PostUpdateUtil from '../../../functions/post_update_util.js'
const { reassemblePhotoPostMain } = PostUpdateUtil;

const PhotoPostInput = ({
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

  return (
    <div
      className={'mainPreview'}
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

      <MainImageInput
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

export default PhotoPostInput;