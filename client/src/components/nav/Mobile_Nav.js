import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Search from '../search/Search';
import MobileMenuDD from './Mobile_Menu_DD';
import MobileSearchOrLogo from './Mobile_Search_Or_Logo';
import RenderSearchOrExitIcon from './Render_Search_Or_Exit_Icon';
import HamburgerOrExitIcon from './Hamburger_Or_Exit_Icon';

import PostFormUtil from '../posts/util/functions/post_form_util.js';
const { preventScroll, allowScroll } = PostFormUtil;

const MobileNav = ({
  activityCounts, 
  userDetailsCounts,
  loggedInBool,
  cursorId
}) => {
  let [menuOpen, openMenu] = useState(false)
  let [settingsOpen, openSettings] = useState(false)
  let [searchOpen, openSearch] = useState(false)
  let scrollYRef = useRef(null)
  let scrollYRef2 = useRef(null)

  useEffect(() => {
    if (menuOpen) {
  
      preventScroll(menuOpen, document)

      var el = document.querySelector('.mobileNav')
      
      if (el) {
        el.focus()
      }
    }

    var listener = window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY
    })

    return () => {
      window.removeEventListener('scroll', listener)
      allowScroll(document)
    }
  }, [menuOpen])

  
  
  if (loggedInBool.isLoggedIn) {
    return (
      <div
        className='mobileNav loggedIn'
        tabIndex={-1}
        onBlur={() => {
          allowScroll(document)
          openMenu(menuOpen = false)
        }}
      >
        <div
          className='hamburgerOrExit'
        >
          <HamburgerOrExitIcon
            menuOpen={menuOpen}
            openMenu={openMenu}
            settingsOpen={settingsOpen}
            openSettings={openSettings}
            scrollYRef={scrollYRef}
            scrollYRef2={scrollYRef2}
          />
        </div>

        <MobileMenuDD
          activityCounts={activityCounts}
          userDetailsCounts={userDetailsCounts}
          loggedInBool={loggedInBool}
          menuOpen={menuOpen}
          openMenu={openMenu}
          settingsOpen={settingsOpen}
          openSettings={openSettings}
          cursorId={cursorId}
          scrollYRef={scrollYRef}
          scrollYRef2={scrollYRef2}
        />

        <MobileSearchOrLogo 
          searchOpen={searchOpen}
          openSearch={openSearch}
        />

        <div
          className='searchOrExitIcon'
        >
          <RenderSearchOrExitIcon
            searchOpen={searchOpen}
            openSearch={openSearch}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className='browserNav loggedOut'
      >
        <div
          className='searchAndLogo'
        >
          <div
            className='logo'
          >
            <img
              src="https://img.icons8.com/fluent-systems-filled/48/ffffff/r.png"
              alt=''  
            />
          </div>
          <Search />
        </div>

        <div
          className='auth'
        >
          <Link
            className='login'
            to='/login'
          >
            Log in
          </Link>
              
          <Link
            className='register'
            to='/register'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    )
  }
}

export default MobileNav;