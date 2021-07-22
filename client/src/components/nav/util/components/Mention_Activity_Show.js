import React from 'react';
import { Link } from 'react-router-dom';

import ProfilePic from '../../../user/util/components/Profile_Pic';

import BylineUtil from '../byline_util.js'
import handlePostIcon from '../handle_post_icon.js';
const { handleByline } = BylineUtil;


const MentionShow = ({
  dropdown, mention, active, setActive
}) => {

  if (mention.post) {
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
          user={mention.user}
          activity={mention}
        />
        <div>
          <Link
            to={`/view/blog/${mention.user.blogName}`}
          >
            <span className='boldUser'>{mention.user.blogName}</span>
          </Link>
          <span>{" "}</span>
          <Link
            to={`/blog/view/${mention.post.user.blogName}/${mention.post._id}`}
          >
            <span className='activitySlug'>mentioned you {handleByline(mention.post)}</span>
          </Link>
        </div>
        {handlePostIcon(mention)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default MentionShow;