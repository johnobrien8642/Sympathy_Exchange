import React from 'react';
import { useHistory } from 'react-router-dom';

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