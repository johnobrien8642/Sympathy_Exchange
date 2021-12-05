import React from 'react';
import bcrypt from 'bcryptjs';
import PleaChainShow from '../util_components/Plea_Chain_Show';


const PleaChain = ({
  pleaChain
}) => {
  let keyHash;
  if (pleaChain.length) {
    keyHash = bcrypt.hashSync(pleaChain[0]._id)
  }
  
  if (pleaChain.length) {
    return (
      <div
        className='plea-chain-container'
      >
        {pleaChain.map(plea => {
          return (
            <PleaChainShow
              uniqHash={keyHash}
              plea={plea}
            />
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