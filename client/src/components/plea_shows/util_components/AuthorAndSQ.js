import React from 'react';
import Score from './Score';
import SympathyOrSaveButton from './Sympathy_Or_Save_Button';
import FollowButton from '../../social/Follow_Button';

const AuthorAndSQ = ({
  plea,
  currentUserId,
  lastPleaInChain
}) => {
  
  function handleSympathyButtonShow() {
    if (lastPleaInChain) {
      return <SympathyOrSaveButton kind={'sympathy'} plea={plea} />
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