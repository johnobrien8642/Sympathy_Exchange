import React from 'react';
import { useQuery } from '@apollo/client';
import FollowButton from '../social/Follow_Button';
import Queries from '../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const TagOrUserShow = ({
  tag,
  user
}) => {
  let { data } = useQuery(CURRENT_USER_ID);

  function handleFollowButton() {
    if (tag || (user._id !== data?.currentUserId)) {
      return <FollowButton tag={tag} user={user} currentUserId={data?.currentUserId} />;
    }
  }

  return (
    <div
      className='tag-show'
    >
      <div
        className='tag-show-header'
      >
        <h1
          className='title'
        >
          {tag.title}
        </h1>
        {handleFollowButton()}
      </div>
    </div>
  )
}

export default TagOrUserShow;