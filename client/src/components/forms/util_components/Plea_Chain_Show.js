import React from 'react';
import AuthorAndSQ from '../../plea_shows/util_components/Author_And_SQ';

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
        <AuthorAndSQ plea={plea} chained={true} />
      </div>
    </div>
  )
};

export default PleaChainShow;