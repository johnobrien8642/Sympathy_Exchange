import React from 'react';
import { Link } from 'react-router-dom';

import FollowButton from '../../social/Follow_Button';

const UserResult = ({
  currentUserId,
  user,
  active,
  setActive
}) => {

  const handleDescription = () => {
    if (user.blogDescription) {
      return <p>{user.blogDescription}</p>
    } else {
      return <br/>
    }
  }
  
  return (
    <React.Fragment>
      <div
        className='userResult'
      >
        <Link
          to={`/user-feed/${user._id}`}
          onClick={() => {
            if (active) {
              setActive(active = false)
            }
          }}
        >
          <h3>{user.username}</h3>
          {handleDescription()}
        </Link>
      </div>
      <FollowButton
        user={user}
        currentUserId={currentUserId}
      />
    </React.Fragment>
  )
}
  

export default UserResult;