import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Score from './Score';
import SympathyOrSaveButton from './Sympathy_Or_Save_Button';
import FollowButton from '../../social/Follow_Button';
import Queries from '../../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const AuthorAndSQ = ({
  plea,
  currentUserId,
  lastPleaInChain
}) => {
  const history = useHistory();
  let { data } = useQuery(CURRENT_USER_ID);
  
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
        <button
          className='author'
          onClick={e => {
            e.preventDefault();

            if (data.currentUserId === plea.authorId._id) {
              history.push(`/dashboard/${plea.authorId._id}`);
            } else {
              history.push(`/user-feed/${plea.authorId._id}`);
            }
          }}
        >
          {plea.authorId.username}
        </button>
        <FollowButton
          user={plea.authorId}
          currentUserId={currentUserId}
        />
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