import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Mutations from '../../../../graphql/mutations.js';
const { DELETE_MY_ACCOUNT } = Mutations;

const DeleteMyAccount = () => {
  let [active, setActive] = useState(false);
  let [password, setPassword] = useState('');
  let [askToConfirm, confirmDelete] = useState(false)
  let [errorMessage, setError] = useState(null)

  let [deleteMyAccount] = useMutation(DELETE_MY_ACCOUNT, {
    onCompleted(data) {
      resetInputs();
      setActive(active = false);
      window.location.reload();
    },
    onError(error) {
      console.log(error)
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setPassword(password = '')
    confirmDelete(askToConfirm = false)
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <div
        className='deleteMyAcct'
      >
        <input
          type='password'
          placeholder='Confirm password...'
          value={password}
          onChange={e => {
            setPassword(password = e.target.value)
          }}
        />
  
        <p>{errorMessage ? `${errorMessage}` : ''}</p>
  
        <div
          className='deleteOrCancelContainer'
        >
          <button
            className='save'
            type='button'
            onClick={() => {
              if (password) {
                setActive(active = false)
                confirmDelete(askToConfirm = true)
              } else {
                setError(errorMessage = 'You must enter your password')
              }
            }}
          >
            Delete My Account
          </button>
          <button
            className='cancel'
            type='button'
            onClick={() => {
              setActive(active = false)
            }}          
          >
            Cancel
          </button>
        </div>
      </div>
    )
  } else if (askToConfirm) {
    return (
      <div
        className='deleteMyAcct confirm'
      >
        <button
          className='confirmDelete'
          onClick={() => {
            deleteMyAccount({
              variables: {
                password: password,
                query: Cookies.get('currentUser'),
                token: Cookies.get('auth-token')
              }
            })
          }}
        >
          <span>Delete my account</span> 
          <span>(This action cannot be undone)</span>
        </button>
        <button
          className='cancel'
          type='button'
          onClick={() => {
            setPassword(password = '')
            confirmDelete(askToConfirm = false)
            setActive(active = false)
          }}
        >
          Cancel
        </button>
      </div>
    )
  } else {
    return (
      <React.Fragment>
        <button
          className='deleteMyAcctBtn'
          onClick={() => {
            setActive(active = true)
            confirmDelete(askToConfirm = true)
          }}
        >
          Delete My Account
        </button>
      </React.Fragment>
    )
  }
}

export default DeleteMyAccount;