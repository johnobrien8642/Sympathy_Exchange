
//reassemble state

const reassembleBody = (body, descriptionImages, descriptions) => {

  var descImgDup = descriptionImages.map(img => ({
    ...img,
    srcType: img.path ? 'oldImgUpload' : 'oldImgLink'
  }))
  
  var descTextDup = descriptions.map(obj => ({
    ...obj,
    srcType: 'oldText'
  }))
  
  body.current = [...descImgDup, ...descTextDup].sort((a, b) => 
    a.displayIdx - b.displayIdx
  )
}

const reassemblePhotoPostMain = (main, mainImages, ) => {

  var mainImgDup = mainImages.map(img => ({
    ...img,
    srcType: img.path ? 'oldImgUpload' : 'oldImgLink'
  }))

  main.current = [...mainImgDup].sort((a, b) => 
    a.displayIdx - b.displayIdx
  )
}

const pushTags = (postTags, tags, setTags) => {
  var titles = postTags.map(tag => tag.title)
  //eslint-disable-next-line
  setTags(tags = titles)
}

const reassembleTextPostStatics = (
  post, title, setTitle
) => {
  setTitle(title = post.title)
}

const PostUpdateUtil = {
  reassembleBody, pushTags,
  reassembleTextPostStatics,
  reassemblePhotoPostMain
};

export default PostUpdateUtil;