import React from 'react';
import Score from './Score';
import SympathyButton from './Sympathy_Button';

const AuthorAndSQ = ({
  plea
}) => {

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
          <SympathyButton plea={plea} />
        </div>
      </div>
    </div>
  )
};

export default AuthorAndSQ;