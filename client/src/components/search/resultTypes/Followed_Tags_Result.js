import React from 'react';

import TagResult from '../resultTypes/Tag_Result';

const FollowedTags = ({
  user,
  followedActive,
  discover
}) => {

  const handleRecentPostCount = (tag) => {
    if (discover) {
      return <span className='recentPostsCount'>{tag.postHeatLastWeek} recent posts</span>
    } else {
      return <span></span>
    }
  }

  if (followedActive) {
    return (
      <React.Fragment>
        <div
          className='followedTagsHeader'
        >
          {discover ? 'Following': 'Tags you follow'}
        </div>

        <ul
          className='followedTags'
        >
          {user.tagFollows.slice(0, 10).map((tag, i) => {
            return (
              <li 
                key={tag._id}
              >
                <div
                  className='tagResultContainer'
                >
                  <TagResult
                    currentUser={user}
                    tag={tag}
                  />
                </div>
                {handleRecentPostCount(tag)}
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default FollowedTags;