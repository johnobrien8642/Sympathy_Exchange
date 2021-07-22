import React from 'react';
import { Link } from 'react-router-dom';

//This is the welcome page for email auth. Go to auth_util
//and begin uncommenting in register function.

const WelcomePage = () => {

  return(
    <div>
      <h1>Your account has been activated</h1>
      <p>Follow the link below to continue on to Rumblr</p>
      <Link to='/dashboard'>Continue</Link>
    </div>
  )
}

export default WelcomePage;