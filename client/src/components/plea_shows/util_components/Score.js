import React from 'react';

const Score = ({
  plea
}) => {

  return (
    <div
      className='score'
    >
      <span>{plea.sympathyCount}</span>
      <span>SQ</span>
    </div>
  )
};

export default Score;