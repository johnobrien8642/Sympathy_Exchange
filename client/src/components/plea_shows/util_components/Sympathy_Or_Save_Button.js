import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations.js';
import Queries from '../../../graphql/queries.js';
import lodash from 'lodash';
const { UNSYMPATHIZE, SYMPATHIZE, SAVE, UNSAVE } = Mutations;
const { CURRENT_USER_ID, FETCH_USER } = Queries;
const { indexOf } = lodash;

const SympathyOrSaveButton = ({
  plea,
  kind
}) => {
  let [buttonState, setButtonState] = useState(null);
  let doActionQuery = useRef(kind === 'sympathy' ? SYMPATHIZE : SAVE);
  let undoActionQuery = useRef(kind === 'sympathy' ? UNSYMPATHIZE : UNSAVE);

  let [relevantActionDo] = useMutation(doActionQuery.current, {
    onCompleted() {
      setButtonState(true);
    }
  });

  let [relevantActionUndo] = useMutation(undoActionQuery.current, {
    onCompleted() {
      setButtonState(false);
    }
  });

  let { data: currentUserIdData } = useQuery(CURRENT_USER_ID);
  const { currentUserId } = currentUserIdData;

  let { loading, error, data: data2 } = useQuery(FETCH_USER, {
    variables: {
      userId: currentUserId
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error in SympOrSave Btn: ${error.message}`;
  
  const { user } = data2;
  const { _id, sympathizedPleaIdsStringArr, savedPleaIdsStringArr } = user;
  const arrToSearch = kind === 'sympathy' ? sympathizedPleaIdsStringArr : savedPleaIdsStringArr;
  const userHasOrDoes =
    indexOf(
      arrToSearch,
      plea._id,
      arrToSearch.length === 1
    );
  
  if (buttonState !== null ? buttonState : (userHasOrDoes >= 0)) {
    return (
      <div
        className={`sympathy-or-save-button-container ${kind === 'sympathy' ? 'sympathized' : 'saved'}`}
      >
        <button
          onClick={e => {
            e.preventDefault();
  
            relevantActionUndo({
              variables: {
                pleaId: plea._id,
                currentUserId: _id
              }
            });
          }}
        >
          {kind === 'sympathy' ? 'Unsympathize' : 'Unsave'}
        </button>
      </div>
    )
  } else {
    return (
      <div
        className='sympathy-or-save-button-container'
      >
        <button
          onClick={e => {
            e.preventDefault();
  
            relevantActionDo({
              variables: {
                pleaId: plea._id,
                currentUserId: _id
              }
            });
          }}
        >
          {kind === 'sympathy' ? 'Sympathize' : 'Save'}
        </button>
      </div>
    )
  }
};

export default SympathyOrSaveButton;