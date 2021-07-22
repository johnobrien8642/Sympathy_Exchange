//preview files
/* eslint-disable no-loop-func */
import axios from 'axios';
import Validator from 'validator';

const handlePostId = (post) => {
  if (post.kind === 'Like' && post.kind === 'Repost') {
    return post.post.post._id
  } else if (post.kind === 'Like') {
    return post.post._id
  } else {
    return post._id
  }
}

const previewMainImages = (
  e, 
  main,
  mainImageFiles,
  setMainImageFiles,
  setErrMessage,
  errMessage,
) => {

  const files = Object.values(e.currentTarget.files)

  if (mainImageFiles.length + 1 > 10) {

    setErrMessage(errMessage = 'Only 10 images can be uploaded here')
    return

  }

  const readAndPreview = (file, i) => {

    var reader = new FileReader();

    reader.onloadend = () => {

      var imgObj = {};
      imgObj.src = reader.result
      imgObj.alt = file.name
      imgObj.srcType = 'newImgFile'
      imgObj._id = null
      imgObj.arrPos = mainImageFiles.length
      file.arrPos = mainImageFiles.length


      main.current.push(imgObj)
      setMainImageFiles(mainImageFiles = [...mainImageFiles, file])

    }

    reader.readAsDataURL(file);

  }

  if (files) {
    files.forEach((f, i) => {
       readAndPreview(f, i)
    });
  }
}

const previewProfilePic = (
  e,
  previewProfilePicRef,
  profileImageFile,
  setProfileImageFile
) => {
  const file = Object.values(e.currentTarget.files)

  var reader = new FileReader();

  reader.addEventListener('load', () => {
    previewProfilePicRef.current.src = reader.result
    previewProfilePicRef.current.alt = ''
    setProfileImageFile(profileImageFile = file)
  }, false)

  if (file[0]) {
    reader.readAsDataURL(file[0])
  }
}

const previewBodyImages = (
    e, 
    body, 
    bodyImageFiles,
    setBodyImageFiles,
    setErrMessage, 
    errMessage
  ) => {

  const files = Object.values(e.currentTarget.files)

  if (bodyImageFiles.length + 1 > 10) {

    setErrMessage(errMessage = 'Only 10 images can be uploaded here')
    return

  }
  
  const readAndPreview = (file, i) => {

    var reader = new FileReader();

    reader.onloadend = () => {

      var imgObj = {};
      imgObj.src = reader.result
      imgObj.alt = file.name
      imgObj.srcType = 'newImgFile'
      imgObj._id = null
      imgObj.arrPos = bodyImageFiles.length
      file.arrPos = bodyImageFiles.length

      body.current.push(imgObj)
      setBodyImageFiles(bodyImageFiles = [...bodyImageFiles, file])
    }

    reader.readAsDataURL(file);

  }

  if (files) {
    files.forEach((f, i) => {
      readAndPreview(f, i)
    });
  }
}

const previewLink = (
  e
) => {
  if (Validator.isURL(e.target.value)) {
    var imgObj = {}
    imgObj.src = e.target.value
    imgObj.alt = ''
    imgObj._id = null
    imgObj.kind = 'Image'
    imgObj.srcType = 'newImgLink'

    return imgObj
  }
}

const previewAudio = (
  e,
  mm,
  audioFile,
  setAudioFile,
  title,
  setTitle,
  artist,
  setArtist,
  album,
  setAlbum,
  src,
  setSrc,
  active,
  setActive,
  objsToClean,
  post
) => {
  const file = e.currentTarget.files[0]
  
  var reader = new FileReader();

  reader.onloadend = () => {
    if (post) {
      objsToClean.current = [post.audioFile]
    }

    mm.parseBlob(file).then(meta => {
      const { common } = meta;
      setTitle(title = common.title || '') 
      setArtist(artist = common.artist || '') 
      setAlbum(album = common.album || '') 
      setSrc(src = reader.result)
      setAudioFile(audioFile = file)
      setActive(active = true)
    })
  }

  reader.readAsDataURL(file)
}

const previewVideoFile = (
  e,
  post,
  videoObj,
  setVideoObj,
  videoFile,
  setVideoFile,
  active, 
  setActive,
  objsToClean
) => {
  const file = e.currentTarget.files[0]
  const videoPath = URL.createObjectURL(file)

  if (post) {
    objsToClean.current = [post.videoLink]
  }

  setVideoFile(videoFile = file)
  setVideoObj(videoObj = videoPath)
  setActive(active = true)
}

const previewVideoLink = (
  e,
  post,
  videoObj,
  setVideoObj,
  videoFile,
  setVideoFile,
  active, 
  setActive,
  objsToClean
) => {
  if (Validator.isURL(e.target.value)) {
    var matched = new RegExp(/youtube|vimeo|twitch|dailymotion/)

    if (matched) {
      if (post) {
        objsToClean.current = [post.videoLink]
      }

      if (videoFile) {
        setVideoFile(videoFile = '')
      }

      setVideoObj(videoObj = e.target.value)
      setActive(active = true)
    }
  }
}

//remove objs

const removeMainObj = (
    srcType, 
    main, 
    setMainImageFiles,
    mainImageFiles,
    objsToClean,
    mainIdx, 
    optionalArrPos
  ) => {

  var plucked = main.current.splice(mainIdx, 1)
  if (srcType === 'oldImgUpload' || srcType === 'oldImgLink') {
    objsToClean.current.push(plucked[0])
  }

  if (srcType === 'newImgFile' && mainImageFiles.length === 1) {

    setMainImageFiles(mainImageFiles = [])

  } else if (srcType === 'newImgFile') {
    var mainImageFileDup = [...mainImageFiles]

    //use arrPos key to find correct
    //image file to delete
    mainImageFileDup.forEach((file, i) => {
      if (file.arrPos === optionalArrPos) {
        mainImageFileDup.splice(i, 1)
      }
    })

    //remap arrPos key for bodyImageFiles and newImgFile
    //in main.current, this ensures consistent
    //drag and drop if file is deleted
    //and uploading a new one
    mainImageFileDup.forEach((f, i) => {
      f.arrPos = i
    })
    
    var i2 = 0
    main.current.forEach((obj, i) => {
      if (obj.srcType === 'newImgFile') {
        obj.arrPos = i2
        i2++
      }
    })

    setMainImageFiles(mainImageFiles = mainImageFileDup)

  }
}

const removeBodyObj = (
    srcType, 
    body,
    setBodyImageFiles, 
    bodyImageFiles,
    objsToClean, 
    bodyIdx,
    optionalArrPos
  ) => {
  
  var plucked = body.current.splice(bodyIdx, 1)
  if (srcType === 'oldImgUpload' || srcType === 'oldImgLink') {
    objsToClean.current.push(plucked[0])
  }

  if (srcType === 'newImgFile' && bodyImageFiles.length === 1) {

    setBodyImageFiles(bodyImageFiles = [])

  } else if (srcType === 'newImgFile') {
    var bodyImageFileDup = [...bodyImageFiles]

    //use arrPos key to find correct
    //image file to delete
    bodyImageFileDup.forEach((file, i) => {
      if (file.arrPos === optionalArrPos) {
        bodyImageFileDup.splice(i, 1)
      }
    })

    //remap arrPos key for bodyImageFiles and newImgFile
    //in body.current, this ensures consistent
    //drag and drop in the case of an image
    //being removed and then a new image added
    bodyImageFileDup.forEach((f, i) => {
      f.arrPos = i
    })
    
    var i2 = 0
    body.current.forEach((obj, i) => {
      if (obj.srcType === 'newImgFile') {
        obj.arrPos = i2
        i2++
      }
    })

    setBodyImageFiles(bodyImageFiles = bodyImageFileDup)

  }
}

const removeTag = (i, tags, setTags) => {
  var filtered = tags.filter((t, i2) => i !== i2)
  setTags(tags = filtered)
}

const removeLinkSiteNameAndImage = (
  siteName, 
  setSitename,
  imageUrl, 
  setImageUrl,
  showNameAndUrl,
  setShowNameAndUrl,
) => {
  setSitename(siteName = '')
  setImageUrl(imageUrl = '')
  setShowNameAndUrl(showNameAndUrl = false)
}

const removeLinkTitleAndDesc = (
  title, 
  setTitle,
  setLinkDescription,
  linkDescription,
  showTitleAndLinkDescription,
  setShowTitleAndLinkDescription,
) => {
  setTitle(title = '')
  setLinkDescription(linkDescription = '')
  setShowTitleAndLinkDescription(showTitleAndLinkDescription = false)
}

const removeAudioObj = (
  post,
  audioObj,
  setAudioObj,
  audioFile,
  setAudioFile,
  active, 
  setActive,
  objsToClean
) => {
  if (post) {
    objsToClean.current = [post.audioLink]
  }

  setAudioFile(audioFile = {})
  setActive(active = false)
}

const removeVideoObj = (
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
) => {
  if (post) {
    objsToClean.current = [post.videoLink]
  }

  setVideoObj(videoObj = {})
  setVideoFile(videoFile = {})
  if (isLink) {
    setIsLink(isLink = false)
  }
  setActive(active = false)
}

const removeProfilePic = (
  previewProfilePicRef,
  profileImageFile,
  setProfileImageFile,
  edit, 
  render,
  setRender
) => {
  previewProfilePicRef.current = {}
  setProfileImageFile(profileImageFile = null)
  
  if (edit) {
    setRender(render + 1)
  }
}

//handle tags

const handleTagInput = (
    tag, 
    setTag,
    tags, 
    setTags
  ) => {
  //eslint-disable-next-line
  var trimmedTag = tag.trim()
    
  var noSingleHash = new RegExp(/^#$/, 'g')
  var validText = trimmedTag.match(noSingleHash)
  
  if (!validText) {
    //eslint-disable-next-line
    var matchText = new RegExp(/[\w+\s+'".,!@$%&*()_+=?<>;:-]*/, 'g')
    var cleanedText = tag.match(matchText)
    if (cleanedText) {
      var cleanedArr = cleanedText.filter(str => str !== '')
      cleanedArr[0].trim()
      setTags(tags.concat(`#${cleanedArr[0]}`))
      setTag(tag = '')
    }
  } else {
    setTag(tag = '')
  }
}

const handleFoundTag = (
    title, 
    setTags,
    tags, 
    setTag,
    tag
  ) => {
  setTags(tags.concat(title))
  setTag(tag = '')
}

//drag and drop

const drag = (e, i, obj) => {
  e.dataTransfer.setData('oldIndex', i)
  e.dataTransfer.setData('obj', obj)
}

const onDropBody = (
  e, 
  i, 
  body, 
  bodyImageFiles
) => {
  let oldIdx = e.dataTransfer.getData('oldIndex')
  let obj = e.dataTransfer.getData('obj')
  let parsedObj = JSON.parse(obj)
  
  if (parsedObj.srcType === 'newImgFile') {

    body.current.splice(oldIdx, 1)
    body.current.splice(i, 0, parsedObj)

    let sortedArrBody = [];
    let filteredBody = body.current.filter(obj => obj.srcType === 'newImgFile');

    bodyImageFiles.forEach((file) => {
      filteredBody.forEach((obj, i) => {
        if (file.arrPos === obj.arrPos) {
          sortedArrBody.splice(i, 0, file)
        }
      })
    })
    
    return sortedArrBody

  } else {
    body.current.splice(oldIdx, 1)
    body.current.splice(i, 0, parsedObj)
    
    return [...bodyImageFiles]
  }
}

const onDropMain = (
  e, 
  i, 
  main,
  mainImageFiles
) => {
  var oldIdx = e.dataTransfer.getData('oldIndex')
  var obj = e.dataTransfer.getData('obj')
  var parsedObj = JSON.parse(obj)

  if (parsedObj.srcType === 'newImgFile') {
    //if we're dragging and dropping an uploaded image
    //the main.current needs to tell mainImageFiles
    //how it should be ordered 
    main.current.splice(oldIdx, 1)
    main.current.splice(i, 0, parsedObj)
  
    let sortedArrMain = [];
    let filteredMain = main.current.filter(obj => obj.srcType === 'newImgFile');
    
    mainImageFiles.forEach((file) => {
      filteredMain.forEach((obj, i) => {
        if (file.arrPos === obj.arrPos) {
          sortedArrMain.splice(i, 0, file)
        }
      })
    })

    return sortedArrMain
  } else {
    main.current.splice(oldIdx, 1)
    main.current.splice(i, 0, parsedObj)

    return [...mainImageFiles]
  }
}

const allowDrop = (e) => {
  e.preventDefault();
}

//async link preview

const fetchUrlMetadata = (link) => {
  return axios.post('/api/posts/metadata', {
    params: {
      url: link
    }
  })
}

//async file upload

const mainPost = (
  mainImagesFormData
) => {
  return axios.post('/api/posts/images', mainImagesFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(mainRes => {
    let mainImgObj = mainRes.data;
    return mainImgObj
  })
}

const bodyPost = (
  bodyImagesFormData
) => {
  return axios.post('/api/posts/images', bodyImagesFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(bodyRes => {
    let bodyImgObj = bodyRes.data;
    return bodyImgObj
  })
}

const audioPost = (
  audioFileFormData
) => {
  return axios.post('/api/posts/audio', audioFileFormData, {
    headers: {
      'Content-Type': 'undefined'
    }
  }).then(audioRes => {
    let audioObj = audioRes.data
    return audioObj
  })
}

const videoPost = (
  videoFileFormData,
  isLink,
  videoObj
) => {
  if (isLink) {
    return axios.post('/api/posts/video', {
      params: {
        url: videoObj
      }
    }).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  } else {
    return axios.post('/api/posts/video', videoFileFormData).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  }
}

//submit functions

const handleMentions = (body, stripAllImgs) => {
  var descContent = stripAllImgs(body).map(d => d.content)
  var mentions = descContent.reduce((array, string) => {
    var regexMention = new RegExp(/@\w+/, 'gm')
    return array.concat(string.match(regexMention))
  }, [])
  
  if (mentions[0] !== null) {
    return Array.from(new Set(mentions))
  } else {
    return []
  }

}

const discardMentions = (post, mentions, objsToClean) => {
  if (post) {
    var oldMentions = post.mentions.map(m => ({
      _id: m._id,
      mention: '@' + m.mention,
      kind: 'Mention'
    }))

    oldMentions.forEach(oldM => {
      if (!mentions.includes(oldM.mention)) {
        objsToClean.current.push(oldM)
      }
    })
  }
}

const handleFormData = (
  imageFileArr
) => {
  var formData = new FormData();
  
  for (var i = 0; i < imageFileArr.length; i++) {
    var file2 = imageFileArr[i];
    formData.append('images', file2);
  }
  
  return formData
}

const stripAllImgs = (refArray) => {
  return refArray.current.filter(obj => {
    if (
      obj.srcType === 'text' ||
      obj.srcType === 'oldText'
    ) {
      return true
    } else {
      return false
    }
  })
}

const handleUploadedFiles = (
  refArray,
  uploads
) => {
  //reinsert uploads
  //at index and reset displayIdx
  var refArrayDup = [...refArray.current]

  var i1 = 0
  refArrayDup.forEach((obj, i) => {
    var upload = uploads[i1]
    if (obj.srcType === 'newImgFile') {
      upload.displayIdx = i
      refArrayDup.splice(i, 1, upload)
      i1++
    }
  })
  
  return refArrayDup.filter(obj => obj.srcType !== 'text')
}

const handleAllTextAudioPost = (allText, descriptions, title, artist, album) => {

  allText.current += title + ' ' + artist + ' ' + album

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })

}

const handleAllTextTextPost = (allText, descriptions, title) => {

  allText.current += title + ' '

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })
  
}

const handleAllTextChatPost = (allText, descriptions, chat) => {

  var span2 = document.createElement('span')
  span2.innerHTML = chat

  allText.current += span2.textContent

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })

}

const handleAllTextLinkPost = (allText, descriptions, linkObj) => {

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })

  Object.values(linkObj).forEach(string => {
    allText.current += string
  })
}

const handleAllTextPhotoPost = (allText, descriptions) => {

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })
}

const handleAllTextQuotePost = (allText, descriptions, quote, source) => {
  
  allText.current += quote
  allText.current += source

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })

}

const handleAllTextVideoPost = (allText, descriptions) => {

  descriptions.forEach(d => {
    var span = document.createElement('span')
    span.innerHTML = d.content
    allText.current += span.textContent
  })
}


//display idx helper

const resetDisplayIdx = (refArr) => {
  refArr.current.forEach((obj, i) => {
    obj.displayIdx = i
  })
}

//update helper

const isUpdate = (post) => {
  if (post) {
    return true
  } else {
    return false
  }
}

//CKEditor helpers

function MentionCustomization( editor ) {
  // The upcast converter will convert view <a class="mention" href="" data-user-id="">
  // elements to the model 'mention' text attribute.
  editor.conversion.for( 'upcast' ).elementToAttribute( {
      view: {
          name: 'a',
          key: 'data-mention',
          classes: 'mention',
          attributes: {
              href: true,
              'data-user-id': true
          }
      },
      model: {
          key: 'mention',
          value: viewItem => {
              // The mention feature expects that the mention attribute value
              // in the model is a plain object with a set of additional attributes.
              // In order to create a proper object use the toMentionAttribute() helper method:
              const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
                  // Add any other properties that you need.
                  link: viewItem.getAttribute( 'href' ),
                  userId: viewItem.getAttribute( 'data-user-id' )
              } );

              return mentionAttribute;
          }
      },
      converterPriority: 'high'
  } );

  // Downcast the model 'mention' text attribute to a view <a> element.
  editor.conversion.for( 'downcast' ).attributeToElement( {
      model: 'mention',
      view: ( modelAttributeValue, { writer } ) => {
          // Do not convert empty attributes (lack of value means no mention).
          if ( !modelAttributeValue ) {
              return;
          }

          return writer.createAttributeElement( 'a', {
              class: 'mention',
              'data-mention': modelAttributeValue.id,
              'data-user-id': modelAttributeValue.actualId,
              'href': `http://localhost:3000/#/view/blog/${modelAttributeValue.id.slice(1, modelAttributeValue.id.length)}`
          }, {
              // Make mention attribute to be wrapped by other attribute elements.
              priority: 20,
              // Prevent merging mentions together.
              id: modelAttributeValue.uid
          } );
      },
      converterPriority: 'high'
  } );
}

//handle scrolling

const preventScroll = (activeVar, document) => {
  if (activeVar) {
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
  }
}

const allowScroll = (document) => {
  document.body.style.height = ''
  document.body.style.overflow = ''
}

const PostFormUtil = {
  handlePostId,
  previewMainImages, 
  previewBodyImages, 
  previewLink,
  previewAudio, 
  previewVideoFile,
  previewVideoLink,
  previewProfilePic,
  removeMainObj,
  removeBodyObj, 
  removeAudioObj,
  removeVideoObj,
  removeProfilePic,
  removeTag, 
  handleTagInput, 
  handleFoundTag,
  drag, 
  onDropBody, 
  onDropMain, 
  allowDrop, 
  removeLinkSiteNameAndImage,
  removeLinkTitleAndDesc,
  fetchUrlMetadata, 
  mainPost, 
  bodyPost,
  audioPost, 
  videoPost,
  handleFormData, 
  stripAllImgs, 
  handleUploadedFiles,
  handleMentions, 
  discardMentions,
  handleAllTextAudioPost, 
  handleAllTextTextPost,
  handleAllTextChatPost,
  handleAllTextLinkPost,
  handleAllTextPhotoPost,
  handleAllTextQuotePost,
  handleAllTextVideoPost,
  resetDisplayIdx,
  isUpdate, 
  MentionCustomization,
  preventScroll,
  allowScroll
};
 
export default PostFormUtil;