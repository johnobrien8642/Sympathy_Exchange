//preview files
/* eslint-disable no-loop-func */
import axios from 'axios';
import Validator from 'validator';

const previewFile = (
    file
  ) => {
    var reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort()
        reject(new DOMException('Problem parsing file'))
      }

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.readAsDataURL(file)
    })  
}

const previewLink = (e) => {
    if (Validator.isURL(e.target.value)) {
      var imgObj = {}
      imgObj.src = e.target.value
      imgObj.alt = ''
      imgObj.kind = 'Image'
      imgObj.status = 'newImgLink'
      imgObj._id = null
    
      return imgObj
    }
}

const previewAudio = (
  e, mm, audioObj, 
  audioFile, 
  active, setActive
) => {
  const file = e.currentTarget.files[0]

  var reader = new FileReader();

  reader.onloadend = () => {
    mm.parseBlob(file).then(meta => {
      const { common } = meta;
      audioObj.current.src = reader.result
      audioObj.current.album = common.album || ''
      audioObj.current.artist = common.artist || ''
      audioObj.current.title = common.title || ''
      audioObj.current.kind = 'audioObj'
      audioFile.current = file
      setActive(active = true)
    })
  }

  reader.readAsDataURL(file)
}

const previewVideoFile = (
  e, 
  videoObj, 
  videoFile,
  active, 
  setActive
) => {
  const file = e.currentTarget.files[0]
  const videoPath = URL.createObjectURL(file)

  videoFile.current = file
  videoObj.current = videoPath
  setActive(active = true)
}

const previewVideoLink = (
  e, videoObj,
  active, setActive
) => {
  if (Validator.isURL(e.target.value)) {
    var matched = new RegExp(/youtube|vimeo|twitch|dailymotion/)

    if (matched) {
      videoObj.current = e.target.value
      setActive(active = true)
    }
  }
}

//remove objs

const removeMainObj = (
  i, 
  main, 
  setMain
  ) => {
  var filtered = main.filter((obj, i2) => i !== i2)
  setMain(main = filtered)
}

const removeBodyObj = (
  i, 
  body, 
  setBody
  ) => {
  var filtered = body.filter((obj, i2) => i !== i2)
  setBody(body = filtered)
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
  audioObj, 
  audioFile,
  active, 
  setActive
) => {
  audioObj.current = {}
  audioFile.current = {}
  setActive(active = false)
}

const removeVideoObj = (
  videoObj, 
  videoFile,
  active, 
  setActive
) => {
  videoObj.current = {}
  videoFile.current = {}
  setActive(active = false)
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
    var matchText = new RegExp(/[\w+\s+.,!@$%&*()_+=?<>;:-]*/, 'g')
    var cleanedText = tag.match(matchText)
    if (cleanedText) {
      var cleanedArr = cleanedText.filter(str => str !== '')
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
  e, i, body, setBody
) => {
  let oldIdx = e.dataTransfer.getData('oldIndex')
  let obj = e.dataTransfer.getData('obj')
  let parsedObj = JSON.parse(obj)
  
  var bodyDup = [...body]
  bodyDup.splice(oldIdx, 1)
  bodyDup.splice(i, 0, parsedObj)
  setBody(body = bodyDup)
}

const onDropMain = (
  e, i, main, setMain
) => {
  var oldIdx = e.dataTransfer.getData('oldIndex')
  var obj = e.dataTransfer.getData('obj')
  var parsedObj = JSON.parse(obj)
  
  var mainDup = [...main]
  mainDup.splice(oldIdx, 1)
  mainDup.splice(i, 0, parsedObj)
  setMain(main = mainDup)
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
  videoObj
) => {
  if (videoObj.current) {
    return axios.post('/api/posts/video', {
      params: {
        url: videoObj.current
      }
    }).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  } else {
    return axios.post('/api/posts/video', videoFileFormData, {
      headers: {
        'Content-Type': 'undefined'
      }
    }).then(videoRes => {
      let videoObj = videoRes.data
      return videoObj
    })
  }
}

const PostCreateUtil = { 
  previewFile,
  previewLink,
  previewAudio, 
  previewVideoFile, 
  previewVideoLink, 
  removeMainObj,
  removeBodyObj, 
  removeAudioObj,
  removeVideoObj, 
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
  videoPost
};

export default PostCreateUtil;