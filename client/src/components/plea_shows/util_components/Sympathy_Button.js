import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations.js';
import Queries from '../../../graphql/queries.js';
const { SYMPATHIZE } = Mutations;
// const { userSympsPlea } = Queries;

const SympathyButton = ({
  plea
}) => {

  let [sympathize] = useMutation(SYMPATHIZE);

  return (
    <div
      className='sympathyBtnContainer'
      >
      <button
        onClick={e => {
          e.preventDefault();

          sympathize({
            variables: {
              pleaId: plea._id
            }
          });
        }}
      >
        Sympathize
      </button>
    </div>
  )
};

export default SympathyButton;