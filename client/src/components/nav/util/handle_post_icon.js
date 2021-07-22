const handlePostIcon = (activity) => {
  
  var post = activity.post.kind === 'Repost' ? activity.post.post : activity.post

  if (activity) {
    if (post.kind === 'TextPost') {
      return (
        <img
          className='textPostIcon'
          src="https://img.icons8.com/ios-filled/64/000000/sentence-case.png"
          alt=''
        />
      )
    } else if (post.kind === 'PhotoPost') {
      return (
        <img
          className='photoPostIcon'
          src="https://img.icons8.com/ios-glyphs/64/000000/camera.png"
          alt=''
        />
      )
    } else if (post.kind === 'QuotePost') {
      return (
        <img
          className='quotePostIcon'
          src="https://img.icons8.com/fluent-systems-filled/64/000000/quote-left.png"
          alt=''
        />
      )
    } else if (post.kind === 'LinkPost') {
      return (
        <img
          className='linkPostIcon'
          src="https://img.icons8.com/metro/64/000000/link.png"
          alt=''
        />
      )
    } else if (post.kind === 'ChatPost') {
      return (
        <img
          className='chatPostIcon'
          src="https://img.icons8.com/fluent-systems-filled/64/000000/speech-bubble-with-dots.png"
          alt=''
        />
      )
    } else if (post.kind === 'AudioPost') {
      return (
        <img
          className='audioPostIcon'
          src="https://img.icons8.com/fluent-systems-filled/64/000000/headphones.png"
          alt=''
        />
    
      )
    } else if (post.kind === 'VideoPost') {
      return (
        <img
          className='videoPostIcon'
          src="https://img.icons8.com/material-rounded/64/000000/camcorder-pro.png"
          alt=''
        />
      )
    }
  }
}

export default handlePostIcon;