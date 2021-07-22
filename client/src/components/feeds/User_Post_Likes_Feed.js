import React from 'react';

import Feed from '../feeds/Feed';

const UserPostLikesFeed = () => {

  return(
    <div
      className='userPostLikesContainer'
    >
      <Feed userLikes={true} />
    </div>
  )
}

export default UserPostLikesFeed;