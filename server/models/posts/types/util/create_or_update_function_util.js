import mongoose from 'mongoose';

const TextPost = mongoose.model('TextPost')
const PhotoPost = mongoose.model('PhotoPost')
const QuotePost = mongoose.model('QuotePost')
const LinkPost = mongoose.model('LinkPost')
const ChatPost = mongoose.model('ChatPost')
const AudioPost = mongoose.model('AudioPost')
const VideoPost = mongoose.model('VideoPost')
const Tag = mongoose.model('Tag')
const User = mongoose.model('User')
const Mention = mongoose.model('Mention')
const Image = mongoose.model('Image')

//create instance

const createInstance = (kind) => {
  switch(kind) {
    case 'TextPost':
      return new TextPost()
    case 'PhotoPost':
      return new PhotoPost()
    case 'QuotePost':
      return new QuotePost()
    case 'LinkPost':
      return new LinkPost()
    case 'ChatPost':
      return new ChatPost()
    case 'AudioPost':
      return new AudioPost()
    case 'VideoPost':
      return new VideoPost()
    default:
      return
  }
}

//handle tags

const getTagArr = async (tags, asyncTag, findOrCreateTag, user) => {
  return Promise.all(tags.map((t, i) => {
        return asyncTag(t, findOrCreateTag, user)
      }
    )
  )
}

const asyncTag = async (t, findOrCreateTag, user) => {
  return findOrCreateTag(t, user)
}

const findOrCreateTag = async (t, user) => {
  return User.findOne({ blogName: user })
    .then(user => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t, user: user._id })
          return newTag.save().then(tag => {
            return tag
          })
        }
    })
  })
}

//handle mentions

const handleMentions = async (
  mentions, 
  asyncMention, 
  findOrCreateMention, 
  user, 
  post
) => {
  return Promise.all(mentions.map((m, i) => {
        return asyncMention(m, findOrCreateMention, user, post)
      }
    )
  )
}

const asyncMention = async (
  m, 
  findOrCreateMention, 
  user, 
  post
) => {
  return findOrCreateMention(m, user, post)
}

const findOrCreateMention = async (m, user, post) => {
  return User.findOne({ blogName: m ? m.slice(1) : null })
    .then(mentioned => {
      return Mention.findOne({ mention: mentioned._id, user: user._id, post: post._id })
        .then(mentionFound => {
          if (mentionFound) {
            return mentionFound
          } else {
            var newMention = new Mention({ 
              mention: mentioned._id,
              user: user._id,
              post: post._id,
              onModel: post.kind
            })

            return newMention.save().then(mention => {
              return mention
            })
          }
    })
  })
}


//handle image links

const createImagesFromLinks = async (imageLinks, asyncImageLink) => {
  return Promise.all(imageLinks.map(link => {
        return asyncImageLink(link)
      }
    )
  )
}

const asyncImageLink = async (link) => {
  var img = new Image()
  img.src = link.src
  img.key = null
  img.displayIdx = link.displayIdx

  return img.save().then(img => {
    return img
  })
}

//handle updating uploaded image files

const updateUploadDispIdx = async (uploads, asyncUpdateUpload) => {
  return Promise.all(uploads.map(upload => {
    return asyncUpdateUpload(upload)
  }))
}

const asyncUpdateUpload = async (upload) => {
  return Image.findById(upload._id).then(img => {
    img.displayIdx = upload.displayIdx
    return img.save().then(img => {
      return img
    })
  })
}

//filtering

const returnInstancesOnly = (imgArr) => {
  return imgArr.filter(obj => {
    if (
      obj.srcType !== 'text' &&
      obj.srcType !== 'oldText' &&
      obj._id !== null
    ) {
      return true
    } else {
      return false
    }
  })
}

const returnNewImageLinksOnly = (imgArr) => {
  return imgArr.filter(obj => obj.srcType === 'newImgLink')
}

const returnMentionInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Mention')
}

const returnImageInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Image')
}

const returnAudioInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Audio')
}

const returnVideoInstancesOnly = (objsToClean) => {
  return objsToClean.filter(obj => obj.kind === 'Video')
}

//handle instance assembly

const allImgObjsSorted = (linkImgs, updatedUploadImgs) => {
  return [...linkImgs, ...updatedUploadImgs].sort((a, b) => 
    a.displayIdx - b.displayIdx
  )
}

const pushDescriptionImgObjs = (objArr, post) => {
  objArr.forEach(obj => {
    post.descriptionImages.push(obj._id)
  })
}

const pushMainImgObjs = (objArr, post) => {
  objArr.forEach(obj => {
    post.mainImages.push(obj._id)
  })
}

const pushDescriptions = (descriptions, post) => {
  descriptions.forEach((obj, i) => {
    post.descriptions.push(obj)
  })
}

const pushTags = (tags, post) => {
  tags.forEach((t, i) => {
    post.tagIds.push(t._id)
    post.tagTitles += t.title
  })
}

const pushMentions = (mentions, post) => {
  mentions.forEach((m, i) => {
    post.mentions.push(m._id)
  })
}

const markModified = (instance, update) => {
  if (update) {
    if (
      instance.kind === 'TextPost' ||
      instance.kind === 'QuotePost' ||
      instance.kind === 'LinkPost' ||
      instance.kind === 'ChatPost' ||
      instance.kind === 'AudioPost' ||
      instance.kind === 'VideoPost'
    
    ) {
      instance.markModified('descriptions')
      instance.markModified('descriptionImages')
      instance.markModified('tags')
      instance.markModified('mentions')

    } else if(
      instance.kind === 'PhotoPost'
    ) {
      instance.markModified('mainImages')
      instance.markModified('descriptions')
      instance.markModified('descriptionImages')
      instance.markModified('tags')
      instance.markModified('mentions')
    }
  }
}

const handleVariants = async (variants, instance, user) => {

  switch(instance.kind) {
    case 'TextPost':
      var { title } = variants
      console.log(title)
      instance.title = title
      instance.user = user._id
      break
    case 'PhotoPost':
      var { mainImages } = variants
      instance.mainImages = [];
      instance.user = user._id;
      
      var uploads = returnInstancesOnly(mainImages)
      var imageLinks = returnNewImageLinksOnly(mainImages)

      var updatedUploadImgs = await updateUploadDispIdx(uploads, asyncUpdateUpload)
      var linkImages = await createImagesFromLinks(imageLinks, asyncImageLink)
      
      var readyMainImgs = allImgObjsSorted(
        linkImages, updatedUploadImgs
      )
    
      pushMainImgObjs(readyMainImgs, instance)
      break
    case 'QuotePost':
      var { quote, source } = variants
      instance.user = user._id
      instance.quote = quote
      instance.source = source
      break
    case 'LinkPost':
      var { linkObj } = variants;
      instance.user = user._id
      instance.linkObj = linkObj
      break
    case 'ChatPost':
      instance.chat = ''
      var { chat } = variants;
      instance.user = user._id
      instance.chat = chat
      break
    case 'AudioPost':
      var { audioFileId, audioMeta } = variants;
      instance.user = user._id
      instance.audioFile = audioFileId
      instance.audioMeta = audioMeta
      break
    case 'VideoPost':
      var { videoLink } = variants;
      instance.user = user._id
      instance.videoLink = videoLink
      break
    default:
      return
  }
}

const resetFoundPost = (instance) => {
  instance.allText = ''
  instance.descriptions = []
  instance.descriptionImages = []
  instance.tagIds = []
  instance.tagTitles = ''
  instance.mentions = []
}

const handleAllText = (allText, instance) => {
  instance.allText = allText
}

const CreateFunctionUtil = {
  getTagArr, asyncTag,
  findOrCreateTag,
  handleMentions,
  asyncMention,
  findOrCreateMention,
  createImagesFromLinks,
  asyncImageLink,
  updateUploadDispIdx,
  asyncUpdateUpload,
  returnInstancesOnly, 
  returnNewImageLinksOnly,
  returnMentionInstancesOnly,
  returnAudioInstancesOnly,
  returnImageInstancesOnly,
  returnVideoInstancesOnly,
  allImgObjsSorted,
  pushDescriptionImgObjs,
  pushMainImgObjs,
  pushDescriptions,
  pushTags,
  pushMentions,
  markModified,
  handleVariants,
  createInstance,
  resetFoundPost,
  handleAllText
}

export default CreateFunctionUtil;