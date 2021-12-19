import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Tags from './util_components/Tags';
import AuthorAndSQ from './util_components/Author_And_SQ';
import ChainPleaButton from './util_components/Chain_Plea_Button';
import SympathyOrSaveButton from './util_components/Sympathy_Or_Save_Button';
import PleaForm from '../forms/Plea_Form';
import Queries from '../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const PleaShow = ({
  plea
}) => {
  let [open, openForm] = useState(false);
  const masterPleaId = plea._id;
  let { data } = useQuery(CURRENT_USER_ID);

  function handleShowCombinedSQ() {
    if (plea.chained) {
      return (
        <div
          className='combined-sq'
        >
          {plea.combinedSympathyCount}
        </div>
      )
    }
  }
  
  return (
    <div
      className={`plea-show-container ${plea._id}`}
    >
      <div
        className='textAndSQContainer'
      >
        {plea.pleaIdChain.map(p => {
          return (
            <div 
              className='inner'
              key={p._id + masterPleaId}
            >
              <div
                className='text'
              >
                {p.text}
              </div>
              <AuthorAndSQ
                plea={p}
                currentUserId={data?.currentUserId}
                lastPleaInChain={p._id === plea.pleaIdChain[plea.pleaIdChain.length - 1]._id}
              />
            </div>
          )
        })}
        {handleShowCombinedSQ()}
      </div>
      <Tags tags={plea.tagIds} />
      <SympathyOrSaveButton kind={'save'} plea={plea} />
      <ChainPleaButton openForm={openForm} />
      <PleaForm
        open={open}
        openForm={openForm}
        pleaProp={plea}
        chaining={true}
        currentUserId={data ? data.currentUserId : null}
      />
    </div>
  )
};

export default PleaShow;