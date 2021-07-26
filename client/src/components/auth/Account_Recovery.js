import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Mutations from '../../graphql/mutations.js';
import Queries from '../../graphql/queries.js';
const { RECOVER_ACCOUNT } = Mutations;
const { IS_LOGGED_IN, FETCH_USER } = Queries;

const AccountRecovery = () => {
  let [errorMessages, addErrorMessage] = useState([]);
  let [phrase, setPhrase] = useState('');
  const history = useHistory();

  let [recoverAccount] = useMutation(RECOVER_ACCOUNT, {
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.recoverAccount.loggedIn,
        }
      })

      client.writeQuery({
        query: FETCH_USER,
        variables: {
          query: data.recoverAccount.username
        },
        data: {
          username: data.recoverAccount.username
        }
      })
    },
    onError(error) {
      addErrorMessage(errorMessages = [])
      error.graphQLErrors.forEach((error, i) => {
        addErrorMessage(errorMessages.concat(error.message))
      })
    },
    onCompleted({ recoverAccount }) {
      const { token, username } = recoverAccount;
      Cookies.set('auth-token', token);
      Cookies.set('currentUser', username);
      resetInputs();
      history.push('/');
    },
  });

  const resetInputs = () => {
    addErrorMessage([])
    setPhrase('')
  };

  return (
    <div
      className='accountRecoveryContainer'
    >
      
      <div
        className='mobileNavigationLinks'
      >
        <img
          alt='sympathy man icon'
          src='./assets/sympathy_man.png'
        />
        <div
          className='loginOrRegisterLinksContainer'
        >
          <Link
            className='login'
            to='/login'
          >
            Login
          </Link>

          <Link
            className='register'
            to='/register'
          >
            Sign up
          </Link>
        </div>
      </div>

      <div
        className='inputAndHeaderContainer'
      >
        <h1>Account Recovery</h1>
        <h3>
          Enter your Secret Recovery Phrase below
          spelled correctly and in the correct order.
        </h3>
        <ul
          className='recoveryErrors'
        >
          {errorMessages.map((errorMessage, i) => {
            return (
              <li 
                className='error'
                key={i}
              >
                {errorMessage}
              </li>
            )
          })}
        </ul>

        <div
          className='inputAndBtnContainer'
        >
          <input
            placeholder='Enter your Secret Recovery Phrase'
            onChange={e => {
              setPhrase(e.target.value)
            }}
          />

          <button
            onClick={() => {
              if (phrase) {
                recoverAccount({
                  variables: {
                    secretRecoveryPhrase: phrase
                  }
                })
              } else {
                addErrorMessage(["You haven't entered anything."])
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountRecovery;