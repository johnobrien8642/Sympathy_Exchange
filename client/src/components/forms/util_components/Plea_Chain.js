import React from 'react';
import bcrypt from 'bcryptjs';
import PleaChainShow from '../util_components/Plea_Chain_Show';


const PleaChain = ({
  pleaChain
}) => {
  if (pleaChain.length) {
    return (
      <div
        className='plea-chain-container'
      >
        {pleaChain.map(plea => {
          return (
            <React.Fragment 
              key={plea._id + bcrypt.hashSync(plea._id + 'PleaChain')}
            >
              <PleaChainShow
                plea={plea}
              />
            </React.Fragment>
          )
        })}
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
};

export default PleaChain;