import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Search from '../search/Search';
import CreatePleaButton from './Create_Plea_Button';
// import UserDetails from './User_Details';
// import ActivityCountIcon from '../nav/Activity_Count_Icon';

const BrowserNav = ({
  user,
  // userDetailsCounts,
  loggedInBool,
}) => {
  let [searchClose, closeSearch] = useState(false);
  // let [activityClose, closeActivity] = useState(false);
  // let [detailsClose, closeDetails] = useState(false);
  // let [activityOpen, setActivityOpen] = useState(false);
  // let [detailsOpen, setDetailsOpen] = useState(false);
  // let cursorId = useRef(new Date().getTime());
  // let totalActivityCountRef = useRef(0);
  let searchRef = useRef(null);

  if (loggedInBool.isLoggedIn) {
    return (
      <div
        className='browserNav loggedIn'
      >
        <div
          className='searchAndLogo'
        >
          <div
            className='logo'
          >
            <Link
              to='/dashboard'
            >
              <img
                alt='sympathy man icon'
                src='./assets/sympathy_man.png'
              />
            </Link>
          </div>
            <Search
              user={user}
              searchClose={searchClose}
              closeSearch={closeSearch}
              searchRef={searchRef}
            />
        </div>

        <CreatePleaButton
          user={user}
        />

        <div
          className='navTools'
        >
          <div
            className='homeLink'
          >
            <Link
              to='/dashboard'
              onClick={() => {
                searchRef.current.blur();
            
                closeSearch(true);
              }}
            >
              <img
                alt='main feed icon'
                src='./assets/main_feed_icon.png'
              />
            </Link>
          </div>
      
          <div
            className='usernameLink'
            tabIndex={0}
            onClick={() => {
              if (!searchClose) {
                closeSearch(true)
              }
            }}
          >
            <Link
              to={`/${user.username}`}
            >
              <span>{user.username}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='browserNav loggedOut'
      >
      </div>
    )
  }
}

export default BrowserNav;