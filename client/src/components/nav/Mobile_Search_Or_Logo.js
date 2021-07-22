import React from 'react';
import { Link } from 'react-router-dom';

import Search from '../search/Search';

const MobileSearchOrLogo = ({
  searchOpen,
  openSearch
}) => {

  if (searchOpen) {
    return (
      <Search
        mobile={true}
        searchOpen={searchOpen}
        openSearch={openSearch}
      />
    )
  } else {
    return (
      <React.Fragment>
        <div
          className='logo'
        >
          <Link
            to='/dashboard'
          >
            <img
              src="https://img.icons8.com/fluent-systems-filled/64/ffffff/r.png"
              alt=''
            />
          </Link>
        </div>
      </React.Fragment>
    )
  }
}

export default MobileSearchOrLogo;