import React from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import ChangeUsername from './util/components/Change_Username';
import ChangePassword from './util/components/Change_Password';
import RevealSecretRecoveryPhrase from './util/components/Reveal_Secret_Recovery_Phrase';
import DeleteMyAccount from './util/components/Delete_My_Account';

import Queries from '../../graphql/queries.js';
const { FETCH_USER } = Queries;

const UserSettings = () => {
  let history = useHistory();
  
  let { loading, error, data, refetch } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { user } = data
  
  return (
    <div
      className='userSettingsContainer'
    >
      <div
        className='userSettings'
      >
        <div
          className='backBtn'
          onClick={() => {
            history.push('/dashboard')
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </div>

        <h1>Account</h1>

        <div
          className='editUsername panel'
        >
          <h3
            className='userSettingHeader'
          >
            Username
          </h3>
          <h3>{user.username}</h3>
          <ChangeUsername
            refetchUser={refetch}
            usernameProp={user.username} 
          />
        </div>

        <div
          className='editPassword panel'
        >
          <h3
            className='userSettingHeader'
          >
            Password
          </h3>
          <ChangePassword user={user} />
        </div>

        <div
          className='revealSecretRecoveryPhrase panel'
        >
          <h3
            className='userSettingHeader'
          >
            Secret Recovery Phrase
          </h3>
          <RevealSecretRecoveryPhrase />
        </div>

        <div
          className='deleteMyAcctContainer panel'
        >
          <h3
            className='userSettingHeader'
          >
            Delete My Account
          </h3>

          <div>THIS NEEDS TO BE FINISHED AFTER CREATING PLEA AND SYMPATHY TYPEs</div>
          {/* <DeleteMyAccount /> */}
        </div>
      </div>
    </div>
  )
}

export default UserSettings;