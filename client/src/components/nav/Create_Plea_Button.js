import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import PleaForm from '../forms/Plea_Form';
import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;

const CreatePleaButton = ({
  user
}) => {
  let [formOpen, openForm] = useState(false);

  let { data } = useQuery(FETCH_USER, {
    variables: {
      userId: user._id
    }
  })
  
  return (
    <div
      className='createPleaContainer'
    >
      <button
        className='createPleaBtn'
        onClick={() => {
          openForm(formOpen ? false : true)
        }}
      >
        Make A Plea
      </button>

      <PleaForm
        open={formOpen}
        openForm={openForm}
        user={data ? data.user : null}
      />
    </div>
  );
};

export default CreatePleaButton;