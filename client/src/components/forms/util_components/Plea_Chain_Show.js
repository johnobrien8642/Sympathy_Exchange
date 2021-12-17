import React from 'react';
import AuthorAndSQ from '../../plea_shows/util_components/AuthorAndSQ';

const PleaChainShow = ({
  plea,
}) => {
  return (
    <div
      className='plea-chain-show-container'
    >
      <div
        className='inner'
      >
        <div
          className='text'
        >
          {plea.text}
        </div>
        <AuthorAndSQ 
          plea={plea}
          chained={true}
        />
      </div>
    </div>
  )
};

export default PleaChainShow;