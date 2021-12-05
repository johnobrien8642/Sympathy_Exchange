import React from 'react';
import Score from './Score';
import SympathyButton from './Sympathy_Button';

const AuthorAndSQ = ({
  plea,
  chained
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