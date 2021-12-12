import React from 'react';

const ChainPleaButton = ({
  openForm
}) => {

  return(
    <React.Fragment>
      <button
        className='chain-plea-button'
        onClick={e => {
          e.preventDefault();

          openForm(true);
        }}
      >
        Chain
      </button>
    </React.Fragment>
  )
};

export default ChainPleaButton;