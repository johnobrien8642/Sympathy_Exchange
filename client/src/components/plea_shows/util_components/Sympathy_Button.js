import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations.js';
import Queries from '../../../graphql/queries.js';
import lodash from 'lodash';
const { UNSYMPATHIZE, SYMPATHIZE } = Mutations;
const { CURRENT_USER_ID, FETCH_USER } = Queries;
const { indexOf } = lodash;

const SympathyButton = ({
  plea
}) => {
  let [symped, setSymped] = useState(null);

  let [sympathize] = useMutation(SYMPATHIZE, {
    onCompleted() {
      setSymped(true);
    }
  });

  let [unsympathize] = useMutation(UNSYMPATHIZE, {
    onCompleted() {
      setSymped(false);
    }
  });

  let { data: currentUserIdData } = useQuery(CURRENT_USER_ID);
  const { currentUserId } = currentUserIdData;

  let { loading, error, data: data2 } = useQuery(FETCH_USER, {
    variables: {
      currentUserId: currentUserId
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error in Symp Btn: ${error.message}`;
  
  const { user } = data2;
  const { _id, sympathizedPleaIdStringArr } = user;

  const sympIndex =
    indexOf(
      sympathizedPleaIdStringArr, 
      plea._id, 
      sympathizedPleaIdStringArr.length === 1 ? false : true
    );

  if (symped ? symped : (sympIndex >= 0)) {
    return (
      <div
        className='sympathyBtnContainer'
        >
        <button
          onClick={e => {
            e.preventDefault();
  
            unsympathize({
              variables: {
                pleaId: plea._id,
                currentUserId: _id
              }
            });
          }}
        >
          Unsympathize
        </button>
      </div>
    )
  } else {
    return (
      <div
        className='sympathyBtnContainer'
        >
        <button
          onClick={e => {
            e.preventDefault();
  
            sympathize({
              variables: {
                pleaId: plea._id,
                currentUserId: _id
              }
            });
          }}
        >
          Sympathize
        </button>
      </div>
    )
  }
};

export default SympathyButton;