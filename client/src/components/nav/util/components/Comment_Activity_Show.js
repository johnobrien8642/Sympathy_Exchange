import React from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import ProfilePic from '../../../user/util/components/Profile_Pic';

import handlePostIcon from '../handle_post_icon.js';
import BylineUtil from '../byline_util.js';
const { handleByline } = BylineUtil;

const CommentShow = ({
  dropdown, comment, active, setActive
}) => {
  
  if (comment.post) {
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
          user={comment.user}
          activity={comment}
        />
        <div>
          <Link
            to={`/view/blog/${comment.user.blogName}`}
          >
            <span className='boldUser'>{comment.user.blogName}</span>
          </Link>
          <span>{" "}</span>
          <Link
            to={`/blog/view/${comment.post.user.blogName}/${comment.post._id}`}
          >
            <span className='activitySlug'>replied to your post {handleByline(comment.post)}</span>
          </Link>
          <div
            className='commentContent'
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(comment.content)
            }}
          />
        </div>
        {handlePostIcon(comment)}
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
  
}

export default CommentShow;