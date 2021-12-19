import React from 'react';
import brcypt from 'bcryptjs';
import { useQuery } from '@apollo/client';
import FollowButton from '../../social/Follow_Button';
import { Link } from 'react-router-dom';
import Queries from '../../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const FollowedList = ({
  user,
  active,
  kind
}) => {
  
  let { data } = useQuery(CURRENT_USER_ID);

  function handleList() {
    if (active) {
      if (kind === 'user') {
        return (
          <>
            {user.userFollows.map(u => {
              return (
                <div
                  className='user'
                  key={u._id + brcypt.hashSync('Followed List')}
                >
                  <Link
                    to={`/user-feed/${u._id}`}
                  >
                    {u.username}
                  </Link>
                  <FollowButton
                    user={u}
                    currentUserId={data ? data.currentUserId : null}
                  />
                </div>
              )
            })}
          </>
        )
      } else if (kind === 'tag') {
        return (
          <>
            {user.tagFollows.map(t => {
              return (
                <div
                  className='tag'
                  key={t._id + brcypt.hashSync('Followed List')}
                >
                  <Link
                    to={`/tag-feed/${t._id}`}
                  >
                    {t.title}
                  </Link>
                  <FollowButton
                    tag={t}
                    currentUserId={data ? data.currentUserId : null}
                  />
                </div>
              )
            })}
          </>
        )
      }
    } else {
      return (
        <></>
      )
    }
  }
  
  return (
    <div
      className='followed-list'
    >
      {handleList()}
    </div>
  )
};

export default FollowedList;