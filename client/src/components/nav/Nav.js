import React, { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import BrowserNav from './Browser_Nav';
import MobileNav from './Mobile_Nav';

import Queries from '../../graphql/queries';
const { IS_LOGGED_IN,
        FETCH_USER_DETAILS_COUNTS,
        FETCH_USER } = Queries;


const Nav = () => {
  let cursorId = useRef(new Date().getTime())
  
  useEffect(() => {

    return () => {
      refetch()
    }
    //eslint-disable-next-line
  }, [])

  var { loading: loading1, 
        error: error1,
        data: userDetailsCounts, 
        refetch } = useQuery(FETCH_USER_DETAILS_COUNTS, {
          variables: {
            query: Cookies.get('currentUser')
          },
          fetchPolicy: 'network-only'
      })

  var { loading: loading2, 
        error: error2, 
        data: fetchedUser } = useQuery(FETCH_USER, {
          variables: {
            query: Cookies.get('currentUser')
          },
      })
      
      var { data: loggedInBool } = useQuery(IS_LOGGED_IN)

      if (loading1 || loading2) return 'Loading...';
      
      if (error1) {
        return `Error: ${error1}`
      } else if (error2) {
        return `Error: ${error2}`
      }

  return (
    <React.Fragment>
      <BrowserNav
        user={fetchedUser.user}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
      <MobileNav
        user={fetchedUser.user}
        userDetailsCounts={userDetailsCounts}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
    </React.Fragment>
  )
}

export default Nav;