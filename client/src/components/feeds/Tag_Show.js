import React from 'react';
import { useQuery } from '@apollo/client';
import FollowButton from '../social/Follow_Button';
import Queries from '../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const TagShow = ({
  tag
}) => {
  let { data } = useQuery(CURRENT_USER_ID);

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
        <FollowButton
          tag={tag}
          currentUserId={data ? data.currentUserId : null}
        />
      </div>
    </div>
  )
}

export default TagShow;