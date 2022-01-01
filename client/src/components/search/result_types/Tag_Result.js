import React from 'react';
import { Link } from 'react-router-dom';

import FollowButton from '../../social/Follow_Button';

const TagResult = ({ 
  currentUserId, 
  tag, 
  active, 
  setActive 
}) => {
  
  return (
    <React.Fragment>
    <Link
        to={`/tag-feed/${tag._id}`}
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
        currentUserId={currentUserId}
      />
    </React.Fragment>
  )
}

export default TagResult;