import React, { } from 'react';
import { Link } from 'react-router-dom';

const ProfilePic = ({
  user,
  activity,
  standaloneLink
}) => {
  
  if (user) {
    let iconUrls = {
      user: user.profilePic ? user.profilePic.src : null,
      default: "https://img.icons8.com/dusk/64/000000/kawaii-ice-cream.png"
    }

    const handleActivityIcon = (activity) => {
      if (activity) {
        if (activity.kind === 'Mention') {
          return (
            <div
              className='mentionActivityIcon'
            >
              <img
                src="https://img.icons8.com/metro/64/ffffff/email.png"
                alt=''
              />
            </div>
          )
        } else if (activity.kind === 'Repost') {
          return (
            <div
              className='repostActivityIcon'
            >
              <img
                src="https://img.icons8.com/material-outlined/64/ffffff/retweet.png"
                alt=''
              />
            </div>
          )
          } else if (activity.kind === 'Comment') {
          return (
            <div
              className='commentActivityIcon'
            >
              <img
                src="https://img.icons8.com/metro/64/ffffff/speech-bubble.png"
                alt=''
              />
            </div>
          )
        } else if (activity.kind === 'Follow') {
          return (
            <div
              className='followActivityIcon'
            >
              <img
                src="https://img.icons8.com/metro/64/ffffff/add-user-male.png"
                alt=''
              />
            </div>
          )
        } else if (activity.kind === 'Like') {
          return (
            <div
              className='likeActivityIcon'
            >
              <img
                src="https://img.icons8.com/material-sharp/64/ffffff/like--v1.png"
                alt=''
              />
            </div>
          )
        }
      }
    }

    if (standaloneLink) {
      return (
        <React.Fragment>
          <Link
            className='standAloneLink'
            to={`/view/blog/${user.blogName}`}
            >
            <img
              className='profilePic'
              src={user.profilePic ? iconUrls.user : iconUrls.default }
              alt='user profile pic'
            />
          </Link>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <img
            className='profilePic'
            src={user.profilePic ? iconUrls.user : iconUrls.default }
            alt='user profile pic'
          />
          {handleActivityIcon(activity)}
        </React.Fragment>
      )
    }  
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default ProfilePic;