import React from 'react';
import Queries from '../../graphql/queries.js';
import Mutations from '../../graphql/mutations.js';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
const { FETCH_PLEA } = Queries;
const { CREATE_OR_CHAIN_PLEA } = Mutations;

const ChainPleaForm = () => {
  const params = useParams();
  const { pleaId } = params;

  let [createOrChainPlea] = useMutation(CREATE_OR_CHAIN_PLEA);

  let { loading, error, data } = useQuery(FETCH_PLEA, {
    variables: {
      pleaId: pleaId
    }
  })

  return (
    <div
      className='chain-plea-form' 
    >
      
    </div>
  )
};

export default ChainPleaForm;