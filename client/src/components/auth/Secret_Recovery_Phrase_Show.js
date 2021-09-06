import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
const { FETCH_SECRET_RECOVERY_PHRASE_AFTER_REGISTER } = Queries;

const SecretRecoveryPhraseShow = () => {
  let [showPhrase, setShowPhrase] = useState(false);
  const location = useLocation();
  const history = useHistory();
  
  let { loading, error, data } = useQuery(FETCH_SECRET_RECOVERY_PHRASE_AFTER_REGISTER, {
    variables: {
      timedToken: location.state ? location.state.timedToken : history.push('/')
    },
  });

  if (loading) return <div className='secretRecoveryPhraseShowContainer'><div className='spinner-grow'/></div>;

  if (error) {
    return(
      <div
        className='secretRecoveryPhraseShowContainer'
      >
        <div className='recoveryError'>
          There was an error retrieving your secret recovery phrase. Please navigate to User Settings to reveal secret recovery phrase.
        </div>
      </div>
    ) 
  };

  const { fetchSecretRecoveryPhraseAfterRegister: phrase } = data;
  
  return (
    <div
      className='secretRecoveryPhraseShowContainer'
    >
      <article>
        <h2>Your Secret Recovery Phrase</h2>
        <h3>Take 60 seconds to read everything below</h3>
        <p>
          Your Secret Recovery Phrase is created once and can never be changed.
          If you forget your username or password then you can use your Secret
          Recovery Phrase to get back into your account. Just enter your
          Secret Recovery Phrase in the same order you see it here. 

        </p>
        <p>
          Write down or save your Secret Recovery Phrase somewhere secure.
        </p>
        <p>
          If you ever forget your username <strong>and</strong> password <strong>and</strong> lose your Secret Recovery
          Phrase <strong>you will not be able to get back into your account. </strong>
          You'll have to create a new one. You can create a new Plea at that point about
          locking yourself out of your own Sympathy Exchange account, or sympathize with
          one that already exists.
        </p>
        <p>
          Click or tap the square below to reveal it (once you're sure no one is 
          looking over your shoulder at the coffee shop).
        </p>
        <h3 className='boldH3'>If I'm logged in can I view my Secret Recovery Phrase?</h3>
        <p>
          Yes, you can view your Secret Recovery Phrase if you're logged in. Just go to 
          user settings and confirm your password.
        </p>
      </article>
      <div
        className='phraseContainer'
      >
        <div
          tabIndex={-1}
          className={showPhrase ? 'phraseHider hidden' : 'phraseHider'}
          onClick={() => {
            setShowPhrase(true)
          }}
        >
          <div>Click or tap here to reveal your Secret Recovery Phrase</div>
        </div>
        <p
          className='phrase'
        >
          {phrase}
        </p>
      </div>

      <Link
        className='confirmBtn'
        to='/'
      >
        I've read the Secret Recovery Phrase explanation, 
        I understand what it's for, and I've stored it somewhere
        safe and secure. Let's get into Sympathy Exchange.
      </Link>
    </div>
  )
};

export default SecretRecoveryPhraseShow;