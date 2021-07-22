import React from 'react';

import FollowButton from '../posts/util/components/social/Follow_Button';

const TagShow = ({
  tag
}) => {

  return (
    <div
      className='tagShow'
    >
      <div
        className='tagShowHeader'
      >
        <h1
          className='title'
        >{tag.title}</h1>
        <FollowButton tag={tag} />
      </div>

      <div
        className='tagShowData'
      >
        <span
          className='followersCount'
        >{tag.followerCount} followers</span>
        <span
          className='postsCount'
        >{tag.postHeatLastWeek} recent posts</span>
      </div>
    </div>
  )
}

export default TagShow;