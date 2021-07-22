import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import ProfilePic from '../../../user/util/components/Profile_Pic';

import BylineUtil from '../byline_util.js'
import handlePostIcon from '../handle_post_icon.js';
const { handleByline } = BylineUtil;


const RepostActivityShow = ({
  dropdown, repost, active, setActive
}) => {
  
  if (repost.post) {

    var caption
    repost.repostTrail.forEach(captionObj => {
      if (captionObj.user._id === repost.user._id) {
        caption = captionObj.caption
      }
    })

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
          user={repost.user}
          activity={repost}
        />
        <div>
          <Link
            to={`/view/blog/${repost.user.blogName}`}
          >
            <span className='boldUser'>{repost.user.blogName}</span>
          </Link>
          <span>{" "}</span>
          <Link
            to={`/blog/view/${repost.user.blogName}/${repost._id}`}
          >
            <span className='activitySlug'>reposted your post {handleByline(repost)}</span>
          </Link>
          <div
            className='repostCaption'
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(caption)
            }}
          />
        </div>
        {handlePostIcon(repost)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default RepostActivityShow;