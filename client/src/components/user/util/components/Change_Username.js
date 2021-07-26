import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import UserSettingsUtil from '../functions/user_settings_util.js'

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USERNAME } = Mutations;
const { updateCacheUpdateEmail } = UserSettingsUtil;

const ChangeUsername = ({
  usernameProp
}) => {
  let emailRef = useRef(usernameProp)
  let [active, setActive] = useState(false);
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState(null);
  console.log(usernameProp)

  let [updateUserEmail] = useMutation(UPDATE_USERNAME, {
    update(client, { data }) {
      const { updateUserEmail } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      updateCacheUpdateEmail(client, updateUserEmail, currentUser, query)
    },
    onCompleted(data) {
      emailRef.current = data.updateUsername.username
      resetInputs()
      setActive(false)
    },
    onError(error) {
      setError(error.message)
    }
  })

  const resetInputs = () => {
    setUsername('')
    setPassword('')
    setError('')
  }

  if (active) {
    return (
      <form
        className='upload'
        onSubmit={e => {
          e.preventDefault();

          updateUserEmail({
            variables: {
              username: username,
              password: password,
              user: Cookies.get('currentUser')
            }
          });
        }}
      >
        <div
          className='inputAndBtnContainer'
        >
          <input
            value={usernameProp}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />

          <p
            className='errMessage'
          >
            {errorMessage ? `${errorMessage}` : ''}
          </p>

          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />

          <div>
            <button
              className='cancel'
              type='button'
              onClick={() => {
                resetInputs()
                setActive(active = false)
              }}
            >
              Cancel
            </button>

            <button
              className='save'
              type='submit'
            >
              Save
            </button>
          </div>
        </div>
      </form>
    )
  } else {
    return (
      <div
        className='settingContainer'
      >
        <p>{emailRef.current}</p>
        <img
          className='editPostBtn'
          src="https://img.icons8.com/windows/64/000000/edit--v1.png"
          alt=''
          onClick={() => {
            setActive(true)
          }}
        />
      </div>
    )
  }
}

export default ChangeUsername;