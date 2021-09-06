import React, { useEffect, useState } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import Nav from '../components/nav/Nav';
import Login from '../components/auth/Login';
import Register from './auth/Register';
import SecretRecoveryPhraseShow from './auth/Secret_Recovery_Phrase_Show';
import AccountRecovery from './auth/Account_Recovery';
import UserSettings from './user/User_Settings';
import UserDashboard from './user/User_Dashboard';
import AuthRoute from '../util/route_util';
import MainPage from './dashboard/Main_Page';
import Queries from '../graphql/queries.js';
import './../stylesheets/application.scss';
// import TagFeed from './feeds/Tag_Feed';
// import UserPostLikesFeed from './feeds/User_Post_Likes_Feed';
// import UserBlogShow from './feeds/User_Blog_Show';
// import UserPostShow from './feeds/User_Post_Show';
// import UserFollowersOrFollowingOrActivityFeed from './feeds/User_Followers_Or_Following_Or_Activity_Feed';
// import Discover from './nav/Discover';
// uncomment below for email auth welcome page
// import WelcomePage from './auth/Welcome_Page';

const { FETCH_ALL_TAGS, CURRENT_USER_ID, IS_LOGGED_IN } = Queries;

const App = () => {
  let [currentUser, setCurrentUser] = useState(Cookies.get('currentUser'));

  useQuery(FETCH_ALL_TAGS);
  let { loading, error, data } = useQuery(CURRENT_USER_ID);

  useEffect(() => {
    var listener = window.addEventListener('scroll', () => {
      document.querySelector('body').style.setProperty('--scroll-y',
      `${window.scrollY}px`)
    })

    return () => {
      window.removeEventListener('scroll', listener);
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  return (
    <React.Fragment>
      <Nav currentUser={currentUser} currentUserId={data ? data.currentUserId : null}/>
      <Switch>
        {/* <AuthRoute path={'/view/tag/:tagTitle'} component={TagFeed} />
        <AuthRoute path={'/view/blog/:blogName'} component={UserBlogShow} />
        <AuthRoute exact path='/blog/view/:blogName/:postId' component={UserPostShow} />
        <AuthRoute 
        exact path={['/followers', '/following', '/activity']} 
        component={UserFollowersOrFollowingOrActivityFeed} 
        />
        <AuthRoute exact path='/discover' component={Discover} />
      <AuthRoute exact path='/likes' component={UserPostLikesFeed} /> */}
        {/* uncomment below for email auth welcome page */}
        {/* <AuthRoute exact path='/welcome' component={WelcomePage} /> */}
        <AuthRoute path={['/dashboard', '/likes']} component={MainPage} />
        <AuthRoute exact path={'/settings/account'} component={UserSettings} />
        <AuthRoute exact path='/register' component={Register} routeType={'auth'} setCurrentUser={setCurrentUser} />
        <AuthRoute exact path='/login' component={Login} routeType={'auth'} setCurrentUser={setCurrentUser} />
        <AuthRoute exact path='/reveal_secret_recovery_phrase' component={SecretRecoveryPhraseShow} />
        <AuthRoute exact path={'/:username'} component={UserDashboard} />
        <Route exact path='/account_recovery' component={AccountRecovery} />
        <Redirect from='/' to='/dashboard' />
      </Switch>
    </React.Fragment>
  );
}

export default App;
