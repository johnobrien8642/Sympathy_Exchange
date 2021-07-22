import React from 'react';
import { Link } from 'react-router-dom';

import ProfilePic from '../../../user/util/components/Profile_Pic';

import handlePostIcon from '../handle_post_icon.js';
import BylineUtil from '../byline_util.js'
const { handleByline } = BylineUtil;

const LikeActivityShow = ({
  dropdown, like, active, setActive
}) => {

  if (like.post) {
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
          user={like.user}
          activity={like}
        />
        <div>
          <Link
            to={`/view/blog/${like.user.blogName}`}
          >
            <span className='boldUser'>{like.user.blogName}</span>
          </Link>
          <span>{" "}</span>
          <Link
            to={`/blog/view/${like.user.blogName}/${like.post._id}`}
          >
            <span className='activitySlug'>liked your post {handleByline(like.post)}</span>
          </Link>
        </div>
        {handlePostIcon(like)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default LikeActivityShow;