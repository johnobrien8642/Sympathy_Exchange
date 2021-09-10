import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useLocation, useHistory, Link } from 'react-router-dom';

import Mutations from '../../graphql/mutations'
import Queries from '../../graphql/queries'
const { LOGIN_USER } = Mutations;
const { IS_LOGGED_IN, CURRENT_USER_ID } = Queries;

const Login = () => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.state) {
      addErrorMessage(errorMessages.concat(location.state.errMessage))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [ loginUser ] = useMutation(LOGIN_USER, {
    update(client, { data }) {
      const { _id, loggedIn, token } = data.loginUser

      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: loggedIn,
        }
      });

      client.writeQuery({
        query: CURRENT_USER_ID,
        data: {
          currentUserId: _id
        }
      });
      
      localStorage.setItem('auth-token', token);
      resetInputs();
    },
    onError(error) {
      addErrorMessage(errorMessages = [])
      error.graphQLErrors.forEach((error, i) => {
        addErrorMessage(errorMessages.concat(error.message))
      });
    },
    onCompleted() {
      history.push('/');
    },
  });
  
  const resetInputs = () => {
    setUsername('');
    setPassword('');
    addErrorMessage([]);
  };

  return (
    <div
      className='loginForm'
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
          Determing how much sympathy you should receive for your given situation.
        </p>
      </div>


      <form
        onSubmit={e => {
          e.preventDefault();
          loginUser({
            variables: {
              username, 
              password 
            }
          })
        }}
      >

        <input
          type='text'
          value={username}
          placeholder={'Username'}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type='password'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(e.target.value)}
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
          Login
        </button>

        <Link
          className='loginLink'
          to='/register'
        >
          Don't have an anonymous account? Sign up, it's easy.
        </Link>

        <Link
          className='loginLink'
          to='/account_recovery'
        >
          Forgot your username or password?
        </Link>
      </form>
    </div>
  );
};

export default Login;
