import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Mutations from '../../../../graphql/mutations.js';
const { UPDATE_USER_PASSWORD } = Mutations;

const Password = ({
  mobile
}) => {
  let [active, setActive] = useState(false);
  let [currentPW, setCurrentPW] = useState('');
  let [newPassword, setNewPassword] = useState('');
  let [confNewPassword, setConfNewPassword] = useState('');
  let [errorMessage, setError] = useState(null)
  let [alert, setAlert] = useState('')

  let [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD, {
    onCompleted(data) {
      resetInputs()
      setAlert('Password updated')
      setTimeout(() => {
        setAlert('')
      }, 5000)
      setActive(false)
    },
    onError(error) {
      setError(error.message)
    }
  });

  const resetInputs = () => {
    setCurrentPW('');
    setNewPassword('');
    setConfNewPassword('');
    setError('');
  };
  
  if (active) {
    return (
      <form
        className='upload'
        onSubmit={e => {
          e.preventDefault()
          if (newPassword === confNewPassword) {
            updateUserPassword({
              variables: {
                currentPW: currentPW,
                newPassword: newPassword,
                user: Cookies.get('currentUser')
              }
            })
          } else {
            setError(errorMessage = "Passwords don't match")
          }
        }}
      >
        <div
          className='inputAndBtnContainer'
        >
          <div
            className='confirmContainer'
          >
            <input
              type='password'
              placeholder='Current password'
              value={currentPW}
              onChange={e => {
                setCurrentPW(e.target.value)
              }}
            />
            <input
              type='password'
              placeholder='New password'
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value)
              }}
            />
            <input
              type='password'
              placeholder='Confirm new password'
              value={confNewPassword}
              onChange={e => {
                setConfNewPassword(e.target.value)
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
                    resetInputs()
                    setActive(false)
                  }}
                >Cancel</button>
                <button
                  className='save'
                  type='submit'
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  } else {
    return (
      <div
        className='inputAndBtnContainer'
      >
        <span
          className={alert ? 'passwordAlert' : 'passwordAlert none'}
        >
          {alert}
        </span>
        <button
          className='changePasswordBtn'
          onClick={() => {
            setActive(true)
          }}
        >
          Change password
        </button>
      </div>
    )
  }
}

export default Password;