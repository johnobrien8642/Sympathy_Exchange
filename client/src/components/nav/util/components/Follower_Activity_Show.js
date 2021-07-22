import React from 'react';
import { Link } from 'react-router-dom';

import ProfilePic from '../../../user/util/components/Profile_Pic';

const FollowerActivityShow = ({
  dropdown, follow, active, setActive
}) => {

  if (follow) {
    return(
      <div
        className='activityResult'
        onClick={() => {
          if (dropdown) {
            setActive(active = false)
          }
        }}
      >
        <ProfilePic 
          user={follow.user}
          activity={follow}
        />
        <div>
          <Link
            to={`/view/blog/${follow.user.blogName}`}
          >
            <span className='activitySlug'><span className='boldUser'>{follow.user.blogName}</span> follows you</span>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default FollowerActivityShow;