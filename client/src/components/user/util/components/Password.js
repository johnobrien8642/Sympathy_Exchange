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
      setAlert(alert = 'Password updated')
      setTimeout(() => {
        setAlert(alert = '')
      }, 5000)
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setCurrentPW(currentPW = '')
    setNewPassword(newPassword = '')
    setConfNewPassword(confNewPassword = '')
    setError(errorMessage = '')
  }

  const renderConfirmPW = () => {
    if (newPassword) {
      return (
        <input
          type='password'
          placeholder='Confirm new password'
          value={confNewPassword}
          onChange={e => {
            setConfNewPassword(confNewPassword = e.target.value)
          }}
        />
      )
    }
  }

  if (active) {
    return (
      <form
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
          <input
            type='password'
            placeholder='Current password'
            value={currentPW}
            onChange={e => {
              setCurrentPW(currentPW = e.target.value)
            }}
          />
          <input
            type='password'
            placeholder='New password'
            value={newPassword}
            onChange={e => {
              setNewPassword(newPassword = e.target.value)
            }}
          />
          {renderConfirmPW()}
          <p
            className='errMessage'
          >{errorMessage ? `${errorMessage}` : ''}</p>
          <div>
            <button
              className='cancel'
              type='button'
              onClick={() => {
                resetInputs()
                setActive(active = false)
              }}
            >Cancel</button>
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
        <p>{alert ? `${alert}` : ''}</p>
        <input
            type='password'
            disabled
            value={'password'}
          />
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

export default Password;