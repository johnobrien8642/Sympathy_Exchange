import React from 'react';

const RenderSearchOrExitIcon = ({
  searchOpen,
  openSearch
}) => {

  if (searchOpen) {
    return (
      <React.Fragment>
        <img
          className='exitIcon'
          src="https://img.icons8.com/ios-filled/64/ffffff/x.png"
          alt=''
          onClick={() => {
            openSearch(searchOpen = false)
          }}
        />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <img
          className='searchIcon'
          src="https://img.icons8.com/android/64/ffffff/search.png"
          alt=''
          onClick={() => {
            openSearch(searchOpen = true)
          }}
        />
      </React.Fragment>
    )
  }
}

export default RenderSearchOrExitIcon;