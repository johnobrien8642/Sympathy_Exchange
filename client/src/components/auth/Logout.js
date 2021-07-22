import React from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import Mutations from '../../graphql/mutations';
import Queries from '../../graphql/queries';
const { LOGOUT_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;

const Logout = ({
  listener
}) => {
  let history = useHistory();

  const [ Logout ] = useMutation(LOGOUT_USER, {
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.logoutUser.loggedIn,
        }
      })
    },
    onCompleted() {
      document.removeEventListener('click', listener, true)
      Cookies.set('auth-token', '')
      Cookies.set('currentUser', '')
      history.push('/')
    },
    onError(error) {
      console.log(error)
    }
  })

  return (
    <React.Fragment>
      <button
        className='logout'
        type='button'
        onClick={e => {
          Logout({ 
            variables: { 
              token: Cookies.get('auth-token')
            }
          })
        }}
      >
        Log out
      </button>
    </React.Fragment>
  )
}

export default Logout;