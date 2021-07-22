import React from 'react';

import PostFormUtil from '../../functions/post_form_util.js'
const { removeLinkTitleAndDesc } = PostFormUtil;

const LinkTitleAndDesc = ({
  showTitleAndLinkDescription, 
  setShowTitleAndLinkDescription, 
  setTitle, 
  title, 
  setLinkDescription, 
  linkDescription,
}) => {

  if (showTitleAndLinkDescription) {
    return (
      <div
        className='linkTitleAndDescContainer'
      >
        <button
          className='removeBtn'
          type='button'
          onClick={() => removeLinkTitleAndDesc(
            title, setTitle,
            setLinkDescription,
            linkDescription,
            showTitleAndLinkDescription,
            setShowTitleAndLinkDescription,
          )
        }
        >
          X
        </button>

        <h2>{title}</h2>
        <p>{linkDescription}</p>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default LinkTitleAndDesc;