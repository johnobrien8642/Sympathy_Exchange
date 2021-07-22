import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import UserSettingsUtil from '../functions/user_settings_util.js'

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USER_EMAIL } = Mutations;
const { updateCacheUpdateEmail } = UserSettingsUtil;

const Email = ({
  userEmail
}) => {
  let emailRef = useRef(userEmail)
  let [active, setActive] = useState(false);
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState(null);

  let [updateUserEmail] = useMutation(UPDATE_USER_EMAIL, {
    update(client, { data }) {
      const { updateUserEmail } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      updateCacheUpdateEmail(client, updateUserEmail, currentUser, query)
    },
    onCompleted(data) {
      emailRef.current = data.updateUserEmail.email
      resetInputs()
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setEmail(email = '')
    setPassword(password = '')
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <form
        className='upload'
        onSubmit={e => {
          e.preventDefault()
          updateUserEmail({
            variables: {
              email: email,
              password: password,
              user: Cookies.get('currentUser')
            }
          })
        }}
      >
        <div
          className='inputAndBtnContainer'
        >
          <input
            value={userEmail}
            onChange={e => {
              setEmail(email = e.target.value)
            }}
          />
          <p
            className='errMessage'
          >{errorMessage ? `${errorMessage}` : ''}</p>
          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(password = e.target.value)
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
            setActive(active = true)
          }}
        />
      </div>
    )
  }
}

export default Email;