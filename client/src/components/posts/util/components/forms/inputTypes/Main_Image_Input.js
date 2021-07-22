import React, { useRef } from 'react';

import PostCreateUtil from '../../../functions/post_create_util.js'
const { previewFile, previewLink } = PostCreateUtil;

const MainImageInput = ({
  formId, 
  main,
  setMain,
  errMessage, 
  setErrMessage
}) => {
  let resultArr = useRef([]);

  return (
    <React.Fragment>
      <h2>Main Images</h2>
        <p>{errMessage}</p>
          <input
            type='file'
            multiple
            name='image'
            accept='.png, .jpg, jpeg'
            onChange={e => {
              var files = Object.values(e.currentTarget.files)

              var i = 0
              while (i < files.length) {
                let name = files[i].name
                let file = files[i]
                
                //eslint-disable-next-line
                previewFile(files[i]).then(result => {
                  var imgObj = {}
                  imgObj.src = result
                  imgObj.alt = name
                  imgObj.kind = 'Image'
                  imgObj.status = 'newImgFile'
                  imgObj._id = null
                  imgObj.file = file
                  
                  resultArr.current.push(imgObj)

                  if (i === files.length) {
                    setMain(main.concat(resultArr.current))
                  }
                })

                i++
              }
              
              document.getElementById(`${formId}`).reset()
            }}
          />
          <textarea
            onChange={e => {
              var newLinkObj = previewLink(e)

              if (newLinkObj) {
                setMain(main.concat(newLinkObj))
                e.target.value = ''
              }
            }}
          ></textarea>
    </React.Fragment>
  )
}

export default MainImageInput;