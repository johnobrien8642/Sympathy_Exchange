import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import randomWords from 'random-words';

import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
const { REGISTER_USER, GENERATE_USERNAME } = Mutations;
const { IS_LOGGED_IN } = Queries;

const Register = () => {
  let [email, setEmail] = useState('');
  let [username, setUsername] = useState(randomWords(3).join('_'));
  let [blogDescription, setBlogDescription] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  let history = useHistory();

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
      if(error.message === 'Account already exists with that email') {
        history.push({
          pathname: '/login',
          state: {
            errMessage: error.message
          }
        })
      } else {
        addErrorMessage(errorMessages = [])
        error.graphQLErrors.forEach((error, i) => {
          addErrorMessage(errorMessages.concat(error.message))
        })
      }
    },
    onCompleted({ registerUser }) {
      const { token, username } = registerUser;
      Cookies.set('auth-token', token)
      Cookies.set('currentUser', username)
      resetInputs();
    }
  })

  const [ generateUsername ] = useMutation(GENERATE_USERNAME, {
    onCompleted({ generateUsername }) {
      setUsername(generateUsername)
    }
  })

  const resetInputs = () => {
    setEmail(email = '');
    setUsername(username = '');
    setPassword(password = '');
    addErrorMessage(errorMessages = []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    var instanceData = {
      email: email,
      username: username,
      password: password,
      blogDescription: blogDescription
    }
    registerUser({
      variables: {
        instanceData: instanceData
      }
    })
  }

  return (
    <div
      className='registerForm'
    >
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
          We pick them for you. You can always try to choose a different
          username later on if for some reason this random one stops
          doing it for you.
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

        <p
          className='formParagraph'
        >
          We send you an authorization email after sign up. <strong>You must
          go to your email and authorize your account before you're
          allowed to make any new Pleas or Variants.</strong> Also if you ever 
          forget your password we can send you a reset link.
        </p>

        <input
          type='text'
          value={email}
          placeholder={'Email'}
          onChange={e => setEmail(email = e.target.value)}
        />

        <input
          type='password'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(password = e.target.value)}
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
          to='/login'
        >
          Already have an account? Log in!
        </Link>
      </form>
    </div>
  )
}

export default Register;