import React from 'react'

import PostFormUtil from '../../../functions/post_form_util.js'
const { removeBodyObj, drag, 
        onDropBody, allowDrop } = PostFormUtil;

const BodyImageDnD = ({
  bodyIdx, 
  img, 
  body, 
  setBodyImageFiles,
  bodyImageFiles,
  render, 
  setRender,
  objsToClean
}) => {

  return (
    <div
      className='draggable imageContentContainer'
      onDrop={e => {
          var sortedBodyImageFiles = onDropBody(
            e, bodyIdx, body,
            bodyImageFiles
          )
          
          setBodyImageFiles(bodyImageFiles = [...sortedBodyImageFiles])
        }
      }
      draggable='true'
      onDragStart={e => drag(e, bodyIdx, JSON.stringify(img))}
      onDragOver={e => allowDrop(e)}
    >
      <button
        className='removeBtn'
        type='button' 
        onClick={() => {
          removeBodyObj(
            img.srcType, body,
            setBodyImageFiles, 
            bodyImageFiles,
            objsToClean, bodyIdx, img.arrPos
          )

          setRender(render + 1)
        }}
      >
        X
      </button>
      <img
        className='imageContent'
        src={img.src} 
        alt={img.alt} 
      />
    </div>
  )
}

export default BodyImageDnD;