const handleByline = (activity) => {
  var post
  if (activity.kind === 'Repost') {
    post = activity.post
  } else {
    post = activity
  }
  
  var words, descriptionsArr = []

  if (post.allText !== 'undefined') {
    words = post.allText.split(' ')
    
    if (words.length > 10) {
      descriptionsArr = words.slice(0, 10)
    } else {
      descriptionsArr = [...words]
    }

    return (
      <span className='byLine'>"{descriptionsArr.join(' ') + '...'}"</span>
    )
  } else {
    return (
      <span>
      </span>
    )
  }
}

const BylineUtil = {
  handleByline
}

export default BylineUtil;