import React, { useEffect } from 'react';

import BodyImageDnD from './dragAndDrop/Body_Image_DnD'
import BodyTextDnD from '../forms/dragAndDrop/Body_Text_DnD'
import BodyImageInput from './inputTypes/Body_Image_Input';
import DescriptionStringInput from './inputTypes/Description_String_Input';

import PostUpdateUtil from '../../functions/post_update_util.js';
const { reassembleBody } = PostUpdateUtil;

const BodyImageAndText = ({
  displayBodyImageAndTextInput,
  post, 
  formId, 
  update,
  formInputId, 
  objsToClean,
  body, 
  bodyImageFiles,
  setBodyImageFiles, 
  description,
  setDescription, 
  render,
  setRender, 
  errMessage,
  setErrMessage
}) => {

  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      reassembleBody(body, post.descriptionImages, post.descriptions)
      setRender(render + 1)
    }
    //eslint-disable-next-line
  }, [])

  if (displayBodyImageAndTextInput) {
    return(
    <div
      className={'bodyPreview'}
    >
        {body.current.map((obj, i) => {
            if (
                obj.srcType === 'newImgFile' ||
                obj.srcType === 'newImgLink' ||
                obj.srcType === 'oldImgUpload' ||
                obj.srcType === 'oldImgLink'
              ) {
                return (
                  <React.Fragment
                    key={i}
                  >
                    <BodyImageDnD
                      bodyIdx={i}
                      img={obj}
                      body={body}
                      bodyImageFiles={bodyImageFiles}
                      setBodyImageFiles={setBodyImageFiles}
                      render={render}
                      setRender={setRender}
                      objsToClean={objsToClean}       
                    />
                  </React.Fragment>
                )
              } else if (
                  obj.srcType === 'text' ||
                  obj.srcType === 'oldText'
                ) {
                return (
                  <React.Fragment
                    key={i}
                  >
                    <BodyTextDnD
                      bodyIdx={i}
                      update={update}
                      formInputId={formInputId}
                      text={obj}
                      body={body}
                      bodyImageFiles={bodyImageFiles}
                      setBodyImageFiles={setBodyImageFiles}
                      render={render}
                      setRender={setRender}
                      objsToClean={objsToClean}
                    />
                  </React.Fragment>
                )
            } else {
              return (
                <div></div>
              )
            }
        })}
  
        <div
          className='bodyImageOrDescriptionStringContainer'
        >
            <BodyImageInput
              formId={formId}
              body={body}
              bodyImageFiles={bodyImageFiles}
              setBodyImageFiles={setBodyImageFiles}
              render={render}
              setRender={setRender}
              errMessage={errMessage}
              setErrMessage={setErrMessage}
            />
  
            <DescriptionStringInput
              body={body}
              update={update}
              description={description}
              setDescription={setDescription}
              formInputId={formInputId}
            />
          </div>
        </div>
    )
  } else {
    return (
      <div></div>
    )
  }
  
}

export default BodyImageAndText;