import React from 'react';

import PostFormUtil from '../../functions/post_form_util.js'
const { removeLinkSiteNameAndImage } = PostFormUtil;

const LinkNameAndImage = ({
  link, showNameAndUrl,
  setShowNameAndUrl,
  siteName, setSiteName,
  imageUrl, setImageUrl
}) => {
  
  if (showNameAndUrl) {
    return (
      <div
        className='linkNameAndImageContainer'
      >
        <button
          className='removeBtn'
          type='button'
          onClick={() => removeLinkSiteNameAndImage(
            siteName, setSiteName, 
            imageUrl, setImageUrl,
            showNameAndUrl, setShowNameAndUrl,
          )}
        >
          X
        </button>
        <a href={link}>
          <span className='siteName'>{siteName}</span>
        </a>
        <img
          src={imageUrl}
          alt={'link page img'}
        />
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default LinkNameAndImage;