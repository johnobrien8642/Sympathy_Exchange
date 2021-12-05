import React, { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import BrowserNav from './Browser_Nav';
import MobileNav from './Mobile_Nav';

import Queries from '../../graphql/queries';
const { IS_LOGGED_IN,
        FETCH_USER } = Queries;

const Nav = ({
  currentUserId
}) => {
  let cursorId = useRef(new Date().getTime());
  
  let { loading: loading2, 
        error: error2, 
        data: fetchedUser, refetch: refetchUser } = useQuery(FETCH_USER, {
          variables: {
            currentUserId: currentUserId
          },
        // fetchPolicy: 'cache-and-network'
      })

    useEffect(() => {
    
      return () => {
        refetchUser()
      };
      //eslint-disable-next-line
    }, [])
      
      var { data: loggedInBool } = useQuery(IS_LOGGED_IN)

      if (loading2) return 'Loading...';
    
      if (error2) return `Error: ${error2}`;
    
  return (
    <React.Fragment>
      <BrowserNav
        user={fetchedUser.user}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
      <MobileNav
        user={fetchedUser.user}
        loggedInBool={loggedInBool}
        cursorId={cursorId}
      />
    </React.Fragment>
  )
}

export default Nav;