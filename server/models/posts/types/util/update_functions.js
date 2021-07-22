import mongoose from 'mongoose';
const Post = mongoose.model('Post')
const Tag = mongoose.model('Tag')
const Image = mongoose.model('Image')

const updateTextPost = ({
  postId, 
  title,
  main, 
  descriptions,
  descriptionImageUploads,
  descriptionImageLinks,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.title = title
    post.main = main
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }
    
    const createImagesFromLinks = async (imageLinks) => {
      return Promise.all(imageLinks.map(link => {
            return asyncImageLink(link)
          }
        )
      )
    }
  
    const asyncImageLink = async (link) => {
      var img = new Image()
      img.src = link.src
      img.displayIdx = link.displayIdx
  
      return img.save().then(img => {
        return img
      })
    }
    
    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })
    
    descriptionImageUploads.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post),
      createImagesFromLinks(descriptionImageLinks)
    ]).then(([tags, images]) => {

      images.forEach(img => {
        post.descriptionImages.splice(img.displayIdx, 0, img._id)
      })

      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updatePhotoPost = ({
  postId, 
  mainImageUploads,
  mainImageLinks,
  descriptions,
  descriptionImageUploads,
  descriptionImageLinks,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.mainImages = []
    post.descriptionImages = []
    post.descriptions = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    const createImagesFromLinks = async (imageLinks) => {
      return Promise.all(imageLinks.map(link => {
            return asyncImageLink(link)
          }
        )
      )
    }
  
    const asyncImageLink = async (link) => {
      var img = new Image()
      img.src = link.src
      img.displayIdx = link.displayIdx
  
      return img.save().then(img => {
        return img
      })
    }

    descriptions.forEach(obj => {
      post.descriptions.push(obj)
    })

    mainImageUploads.forEach(img => {
      post.mainImages.push(img._id)
    })

    descriptionImageUploads.forEach(img => {
      post.descriptionImages.push(img._id)
    })

    return Promise.all([
      getTagArr(tags, post),
      createImagesFromLinks(descriptionImageLinks),
      createImagesFromLinks(mainImageLinks)
    ]).then(([tags, descriptionImages, mainImages]) => {

      descriptionImages.forEach(img => {
        post.descriptionImages.splice(img.displayIdx, 0, img._id)
      })

      mainImages.forEach(img => {
        post.mainImages.splice(img.displayIdx, 0, img._id)
      })

      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updateQuotePost = ({
  postId, quote, 
  source, descriptions,
  descriptionImages,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.quote = quote
    post.source = source
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })

    descriptionImages.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post)
    ]).then(([tags]) => {
      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updateLinkPost = ({
  postId, 
  linkObj,
  descriptions,
  descriptionImages,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.linkObj = linkObj
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })

    descriptionImages.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post)
    ]).then(([tags]) => {
      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updateAudioPost = ({
  postId, 
  audioMeta,
  descriptions,
  descriptionImages,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.audioMeta = audioMeta
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })

    descriptionImages.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post)
    ]).then(([tags]) => {
      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updateChatPost = ({
  postId, 
  chat,
  descriptions,
  descriptionImages,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.chat = chat
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })

    descriptionImages.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post)
    ]).then(([tags]) => {
      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const updateVideoPost = ({
  postId, 
  descriptions,
  descriptionImages,
  tags
}) => {
  return Promise.all([
    Post.findOne({ _id: postId })
  ]).then(([post]) => {
    post.descriptions = []
    post.descriptionImages = []
    post.tags = []

    const getTagArr = async (tags, post) => {
      return Promise.all(tags.map((t, i) => {
            return asyncTag(t, post)
          }
        )
      )
    }
  
    const asyncTag = async (t, post) => {
      return findOrCreateTag(t, post)
    }
  
    const findOrCreateTag = async (t, post) => {
      return Tag.findOne({ title: t }).then(tagFound => {
        if (tagFound) {
          return tagFound
        } else {
          var newTag = new Tag({ title: t })
          return newTag.save().then(tag => {
            return tag
          })
        }
      })
    }

    descriptions.forEach((obj, i) => {
      post.descriptions.push(obj)
    })

    descriptionImages.forEach((img) => {
      post.descriptionImages.push(img._id)
    })

    
    return Promise.all([
      getTagArr(tags, post)
    ]).then(([tags]) => {
      tags.forEach(t => {
        post.tags.push(t._id)
      })
      return Promise.all(([post.save()]))
        .then(([post]) => post)
    })
  })
}

const UpdateFunctions = {
  updateTextPost, 
  updatePhotoPost, 
  updateQuotePost, 
  updateLinkPost,
  updateChatPost, 
  updateAudioPost,
  updateVideoPost
}

export default UpdateFunctions;