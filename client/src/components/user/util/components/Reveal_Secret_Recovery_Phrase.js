import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useLazyQuery } from '@apollo/client';

import Queries from '../../../../graphql/queries.js';
const { FETCH_SECRET_RECOVERY_PHRASE } = Queries;

const RevealSecretRecoveryPhrase = () => {
  let [active, setActive] = useState(false);
  
  let [fetchSRP, { loading, error, data }] = useLazyQuery(FETCH_SECRET_RECOVERY_PHRASE, {
    variables: {
      token: Cookies.get('auth-token')
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  if (active) {
    return (
      <div
        className='phraseAndHideBtnContainer'
      >
      <p
        className='secretPhrase'
      >{data ? data.fetchSecretRecoveryPhrase : ''}</p>
        <button
          className='hideBtn'
          onClick={() => {
            setActive(false)
          }}
        >
          Hide
        </button>
      </div>
    )
  } else {
    return (
      <div
        className='inputAndBtnContainer'
      >
        <button
          className='revealBtn'
          onClick={() => {
            setActive(true);
            fetchSRP();
          }}
        >
          Reveal
        </button>
      </div>
    )
  };
}

export default RevealSecretRecoveryPhrase;