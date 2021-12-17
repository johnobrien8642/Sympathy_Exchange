import React from 'react';
import { useMutation } from '@apollo/client';
import Mutations from '../../../graphql/mutations.js';
import Queries from '../../../graphql/queries.js';
const { SAVE_PLEA } = Mutations;
const { } = Queries;


const SavePleaButton = ({
  plea
}) => {

  return (
    <button
      className='save-plea-button'
      onClick={e => {
        e.preventDefault();


      }}
    >
      Save Plea Button
    </button>
  )
};

export default SavePleaButton;