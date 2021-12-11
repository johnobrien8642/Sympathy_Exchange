import React from 'react';
import Score from './Score';
import SympathyButton from './Sympathy_Button';
import FollowButton from '../../social/Follow_Button';

const AuthorAndSQ = ({
  plea,
  chained,
  currentUserId
}) => {
  function handleSympathyButtonShow() {
    if (!chained) {
      return <SympathyButton plea={plea} />
    }
  }

  return (
    <div
      className='SQContainer'
    >
      <div
        className='innerSQContainer'
      >
        <span
          className='author'
        >
          {plea.author.username}
          <FollowButton 
            user={plea.author}
            currentUserId={currentUserId}
          />
        </span>

        <div
          className='scoreAndSympathyButtonContainer'
        >
          <Score plea={plea} />
          {handleSympathyButtonShow()}
        </div>
      </div>
    </div>
  )
};

export default AuthorAndSQ;