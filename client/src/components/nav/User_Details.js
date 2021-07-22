import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Logout from '../auth/Logout.js';
import ProfilePic from '../user/util/components/Profile_Pic';

const UserDetails = ({
  user,
  detailsClose,
  detailsOpen,
  setDetailsOpen
}) => {
  let [active, setActive] = useState(false)
  let listenerRef = useRef(null)

  useEffect(() => {
    var el = document.querySelector('.userDetails')

    if (el) {
      el.focus()
    }
    
    //eslint-disable-next-line
  }, [detailsClose, detailsOpen, active])
  
  if (detailsOpen) {
    const { 
      totalLikeCount,
      userFollowCount, 
      userPostsCount,
      followersCount,
      blogName,
      blogDescription } = user;

    return (
      <div
        className='userDetails'
        tabIndex={0}
        onBlur={e => {
          if (!e.relatedTarget) {
            setDetailsOpen(detailsOpen = false)
          }
        }}
      >
        <div
          className='userHeader'
        >
          <span>Account</span>

          <Logout
            listener={listenerRef.current}
            active={active}
            setActive={setActive}
          />
        </div>
      
        <ul>

          <li>
            <Link
              to='/likes'
            >
              <img
                className='detailIcon'
                src="https://img.icons8.com/material-rounded/24/000000/like--v1.png" 
                alt='' 
              />
              Likes
            </Link>
            <span>{totalLikeCount}</span>
          </li>

          <li>
            <Link 
              to='/following'
            >
              <img 
                className='detailIcon'
                src="https://img.icons8.com/metro/26/000000/add-user-male.png"
                alt=''
              />
              Following
            </Link>
            <span>{userFollowCount}</span>
          </li>

          <li>
            <Link 
              to='/settings/account'
            >
              <img
                className='detailIcon'
                src="https://img.icons8.com/material-sharp/24/000000/settings.png"
                alt=''
              />
              Settings
            </Link>
          </li>

          <li
            className='separator'
          >
          </li>

          <li
            className='blogDescription'
          > 
            <Link 
              to={`/view/blog/${blogName}`}
            >
              <ProfilePic 
                user={user}
                standaloneLink={false}
              />
              <div>
                <h3>{blogName}</h3>
                <p>{blogDescription}</p>
              </div>
            </Link>
          </li>

          <li>
            <Link
              className='blogDetailData'
              to={`/view/blog/${blogName}`}
            >
              <p>Posts</p>
            </Link>
              <span className='detailCount'>{userPostsCount}</span>
          </li>

          <li>
            <Link
              className='blogDetailData'
              to='/followers'
            >
              <p>Followers</p>
            </Link>
              <span className='detailCount'>{followersCount}</span>
          </li>

          <li>
            <Link
              className='blogDetailData'
              to='/activity'
            >
              <p>Activity</p>
            </Link>
          </li>
          
        </ul>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

// const handleByLine = (user) => {
//   var words, descriptionArr = []

//   if (user.blogDescription) {
//     words = user.blogDescription.split(' ')
    
//     if (words.length > 8) {
//       descriptionArr = words.slice(0, 8)

//       return (
//         <p>{descriptionArr.join(' ') + '...'}</p>
//       )
//     } else {
//       descriptionArr = [...words]

//       return (
//         <p>{descriptionArr.join(' ')}</p>
//       )
//     }

//   } else {
//     return (
//       <p></p>
//     )
//   }
// }

export default UserDetails;