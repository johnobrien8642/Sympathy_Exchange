import React from 'react';
import { Link } from 'react-router-dom';

import FollowButton from '../../posts/util/components/social/Follow_Button';
import ProfilePic from '../../user/util/components/Profile_Pic';

const UserResult = ({
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
        <ProfilePic user={user} standaloneLink={true} />
        <Link
          to={`/view/blog/${user.blogName}`}
          onClick={() => {
            if (active) {
              setActive(active = false)
            }
          }}
        >
          <h3>{user.blogName}</h3>
          {handleDescription()}
        </Link>
      </div>
      <FollowButton
        user={user}
      />
    </React.Fragment>
  )
}
  

export default UserResult;