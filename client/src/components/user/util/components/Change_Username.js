import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import UserSettingsUtil from '../functions/user_settings_util.js'

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USERNAME, GENERATE_USERNAME } = Mutations;
const { updateCacheUpdateUsername } = UserSettingsUtil;

const ChangeUsername = ({
  usernameProp,
  refetchUser
}) => {
  let [active, setActive] = useState(false);
  let [confirm, setConfirm] = useState(false);
  let [username, setUsername] = useState(usernameProp);
  let [newUsername, setNewUsername] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState('');
  let [updateAlert, setUpdateAlert] = useState('');
  let [showUpdateBtn, setShowUpdateBtn] = useState(false);

  let [updateUserEmail] = useMutation(UPDATE_USERNAME, {
    update(client, { data }) {
      const { updateUsername } = data;
      var currentUser = updateUsername.username
      var query = FETCH_USER
      
      updateCacheUpdateUsername(client, updateUsername, currentUser, query);
    },
    onCompleted(data) {
      console.log(data)
      const { updateUsername } = data;
      setNewUsername('');
      setUsername(updateUsername.username);
      Cookies.set('currentUser', updateUsername.username);
      resetInputs();
      setActive(false);
      setShowUpdateBtn(false);
    },
    onError(error) {
      setError(error.message);
    }
  })

  let [generateUsername] = useMutation(GENERATE_USERNAME, {
    onCompleted(data) {
      setNewUsername(data.generateUsername)
    }
  })

  const resetInputs = () => {
    setUsername('')
    setPassword('')
    setError('')
  }

  const toggleUpdate = () => {
    if (active) {
      return (
        <div
          className='confirmContainer'
        >
          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(e.target.value)
            }}
          />

          <p>
            This action cannot be undone. Once you click confirm
            your username will be permanently updated.
          </p>

          <div
            className='innerConfirmContainer'
          >
            <input
              id='confirmChangeUsername'
              type='checkbox'
              onChange={() => {
                setConfirm(confirm ? false : true)
              }}
            />
            <label htmlFor={'confirmChangeUsername'}>I understand</label>
          </div>

          <p className={updateAlert ? 'confirmAlert' : 'confirmAlert none'}>{updateAlert}</p>
          
          <div
            className='saveOrCancelContainer'
          >
            <button
              className='cancel'
              type='button'
              onClick={() => {
                resetInputs()
                setActive(false)
              }}
            >
              Cancel
            </button> 
            <button
              className='save'
              type='submit'
              onClick={e => {
                if (!confirm) {
                  e.preventDefault();
                  
                  setUpdateAlert("Please check 'I understand' if you wish to proceed")
                } else if (!password) {
                  e.preventDefault();

                  setUpdateAlert('Please confirm your password')
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <button
          className={showUpdateBtn ? 'updateBtn' : 'updateBtn none'}
          type='button'
          onClick={() => {
            setActive(true)
          }}
        >
          Update username
        </button>
      )
    }
  }

  return (
    <form
      className='upload'
      onSubmit={e => {
        e.preventDefault();

        updateUserEmail({
          variables: {
            username: newUsername,
            password: password,
            user: Cookies.get('currentUser')
          }
        });
      }}
    >
      <div
        className='inputAndBtnContainer'
      >
        <span
          className={newUsername ? 'newUsername' : 'newUsername none'}
        >
          {newUsername}
        </span>
        
        {toggleUpdate()}

        <button
          className='generateUsernameBtn'
          onClick={e => {
            e.preventDefault();

            setShowUpdateBtn(true);
            generateUsername();
          }}
        >
          Generate another username
        </button>
      </div>
    </form>
  )
}

export default ChangeUsername;