import React, { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomWords from 'random-words';

import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
const { REGISTER_USER, GENERATE_USERNAME } = Mutations;
const { IS_LOGGED_IN, FETCH_USER, CURRENT_USER } = Queries;

const Register = ({
  setCurrentUser
}) => {
  let [username, setUsername] = useState(randomWords(3).join('_'));
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  const history = useHistory();
  
  const [ registerUser ] = useMutation(REGISTER_USER, {
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.registerUser.loggedIn,
        }
      })
    },
    onError(error) {  
      addErrorMessage(errorMessages = [])
      error.graphQLErrors.forEach((error, i) => {
        addErrorMessage(errorMessages.concat(error.message))
      })
    },
    onCompleted({ registerUser }) {
      const { token, username, timedSecretRecoveryPhraseAccessToken } = registerUser;
      Cookies.set('auth-token', token);
      Cookies.set('currentUser', username);
      resetInputs();
      setCurrentUser(username)

      history.push({ 
        pathname: '/reveal_secret_recovery_phrase', 
        state: { timedToken: timedSecretRecoveryPhraseAccessToken } 
      })
    }
  })

  const [ generateUsername ] = useMutation(GENERATE_USERNAME, {
    onCompleted({ generateUsername }) {
      setUsername(generateUsername);
    }
  });

  const resetInputs = () => {
    setUsername(username = '');
    setPassword(password = '');
    addErrorMessage(errorMessages = []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (password.length === 0 && confirmPassword.length === 0) || 
      (password !== confirmPassword)
    ) {
      addErrorMessage(["Your passwords don't match, try again"])
    } else {
      registerUser({
        variables: {
          registerUserInputData: {
            username: username,
            password: password,
            secretRecoveryPhrase: randomWords(10).join(' ')
          }
        }
      })
    }
  }

  return (
    <div
      className='registerForm'
    >
      <Link
        className='backToSympathyExchangeLink'
        to='/'
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Back to Sympathy Exchange
      </Link>
      <div
        className='greetingHeader'
      >
        <h1>Sympathy Exchange</h1>
        <p>
          Welcome to Sympathy Exchange, thank you for deciding to become
          a contributor. Here at Sympathy Exchange we're trying to figure
          out just how much sympathy you're supposed to be getting for 
          whatever it is that you're going through.
        </p>
      </div>

        <form
          onSubmit={e => {
            handleSubmit(e)
          }}
        >

        <p
          className='formParagraph'
        >
          At Sympathy Exchange all usernames are random and anonymous. 
          We pick them for you. You can always try to generate a new and 
          different username later on if for some reason this random one 
          stops doing it for you.
        </p>

        <input
          type='text'
          disabled
          value={username}
        />

        <button
          onClick={e => {
            e.preventDefault();
            generateUsername();
          }}       
        >
          Generate another username
        </button>
        
        <input
          type='password'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type='password'
          value={confirmPassword}
          placeholder={'Confirm password'}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <ul
          className='authErrors'
        >
          {errorMessages.map((error, i) => {
            return <li key={i}>{error}</li>
          })}
        </ul>

        <button
          type='submit'
        >
          Sign up
        </button>

        <Link
          className='loginLink'
          to='/login'
        >
          Already have an account? Come right this way.
        </Link>
      </form>
    </div>
  )
}

export default Register;