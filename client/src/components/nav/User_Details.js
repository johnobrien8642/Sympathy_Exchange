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
    const { username } = user;

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
              to={`/view/blog/${username}`}
            >
              <ProfilePic 
                user={user}
                standaloneLink={false}
              />
              <div>
                <h3>{username}</h3>
              </div>
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