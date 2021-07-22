import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Queries from '../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const AuthRoute = ({
  component: Component,
  path,
  exact,
  routeType,
  ...rest
}) => {
  const { data } = useQuery(IS_LOGGED_IN);
  if (routeType === 'auth') {
    return (
      <Route
        path={path}
        exact={exact}
        {...rest}
        render={props =>
          !data.isLoggedIn ? <Component {...props} /> : <Redirect to='/' />
        }
      />
    )
  } else {
    return (
      <Route
        {...rest}
        render={
          props => data.isLoggedIn ? (
            <Component {...props}/>
          ) : (
            <Redirect to='/login' />
          )
        }
      />
    )
  }
}

export default AuthRoute;