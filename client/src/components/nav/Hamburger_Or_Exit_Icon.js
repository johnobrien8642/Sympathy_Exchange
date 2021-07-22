import React from 'react';
import PostFormUtil from '../posts/util/functions/post_form_util.js';
const { allowScroll, preventScroll } = PostFormUtil;

const HamburgerOrExitIcon = ({
  menuOpen,
  openMenu,
  settingsOpen,
  openSettings,
  scrollYRef,
  scrollYRef2
}) => {

  if (menuOpen) {
    return (
      <React.Fragment>
        <img
        className='exitIcon'
        onClick={() => {
          openSettings(settingsOpen = false)
          openMenu(menuOpen = false)
          allowScroll(document)
        }}
          src="https://img.icons8.com/ios-filled/64/ffffff/x.png"
          alt=''
        />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <img
        className='hamburgerIcon'
        onClick={() => {
          scrollYRef2.current = scrollYRef.current

          openSettings(settingsOpen = false)
          openMenu(menuOpen = true)
          preventScroll(menuOpen, document)
        }}
          src="https://img.icons8.com/fluent-systems-filled/64/ffffff/menu.png"
          alt=''
        />
      </React.Fragment>
    )
  }
}

export default HamburgerOrExitIcon;