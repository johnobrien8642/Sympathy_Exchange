import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import PleaForm from '../forms/Plea_Form';
import Queries from '../../graphql/queries.js';
import Cookies from 'js-cookie';
const { FETCH_USER } = Queries;

const CreatePleaButton = () => {
  let [formOpen, openForm] = useState(false);

  let { data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
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
        close={openForm}
        user={data ? data.user : null}
      />
    </div>
  );
};

export default CreatePleaButton;