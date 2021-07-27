import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Mutations from '../../../../graphql/mutations.js';
const { DELETE_MY_ACCOUNT } = Mutations;

const DeleteMyAccount = () => {
  let [active, setActive] = useState(false);
  let [password, setPassword] = useState('');
  let [confirmDelete, setConfirmDelete] = useState(false)
  let [errorMessage, setError] = useState(null)

  let [deleteMyAccount] = useMutation(DELETE_MY_ACCOUNT, {
    onCompleted(data) {
      resetInputs();
      setActive(active = false);
    },
    onError(error) {
      setError(error.message)
    }
  })

  const resetInputs = () => {
    setPassword(password = '')
    confirmDelete(confirmDelete = false)
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <div
        className='deleteMyAcct upload'
      >
        <div
          className='inputAndBtnContainer'
        >
          <div
            className='confirmContainer'
          >
            <p
            >
              This cannot be undone. Once you delete your account
              all of your unchained Pleas will be deleted. All of 
              your other Pleas that have been chained will not
              be deleted, but your username will be removed from
              the Plea. All of your Symps will also be deleted.
            </p>
            <input
              type='password'
              placeholder='Confirm password...'
              value={password}
              onChange={e => {
                setPassword(e.target.value)
              }}
            />
            <div
              className='innerConfirmContainer'
            >
              <p
                className='errMessage'
              >{errorMessage ? `${errorMessage}` : ''}</p>
              <div
                className='saveOrCancelContainer'
              >
                <button
                  className='cancel'
                  type='button'
                  onClick={() => {
                    setActive(false)
                    setConfirmDelete(false)
                  }}          
                >
                  Cancel
                </button>

                <button
                  className='save'
                  type='button'
                  onClick={() => {
                    if (password) {
                      setActive(false)
                      setConfirmDelete(true)
                    } else {
                      setError('You must enter your password')
                    }
                  }}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (confirmDelete) {
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
            setPassword('');
            setConfirmDelete(false);
            setActive(false);
          }}
        >
          Cancel
        </button>
      </div>
    )
  } else {
    return (
      <div
        className='inputAndBtnContainer'
      >
        <button
          className='deleteMyAcctBtn'
          onClick={() => {
            setActive(true);
            setConfirmDelete(true);
          }}
        >
          Delete My Account
        </button>
      </div>
    )
  };
};

export default DeleteMyAccount;