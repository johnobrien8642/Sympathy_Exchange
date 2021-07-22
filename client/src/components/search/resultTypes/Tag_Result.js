import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import FollowButton from '../../posts/util/components/social/Follow_Button'

const TagResult = ({ 
  currentUser, 
  tag, 
  active, 
  setActive 
}) => {
  let doesUserFollowTagRef = useRef(false)

  if (currentUser) {
    doesUserFollowTagRef.current =
    currentUser.tagFollows.some(obj => obj._id === tag._id)
  }

  var cleanedTag = tag.title.slice(1)
  
  return (
    <React.Fragment>
    <Link
        to={`/view/tag/${cleanedTag}`}
        onClick={() => {
          if (active) {
            setActive(active = false)
          }
        }}
      >
        {tag.title}
      </Link>
      <FollowButton
        tag={tag} 
        followed={doesUserFollowTagRef.current}
      />
    </React.Fragment>
  )
}

export default TagResult;