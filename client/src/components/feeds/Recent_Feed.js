import React from 'react';
import bcrypt from 'bcryptjs';
import Loading from '../shared_util/Loading';
import PleaShow from '../plea_shows/Plea_Show';
import { useQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
const { RECENTS } = Queries;

const RecentFeed = () => {

  function handleLoadingIcon() {
    if (loading) {
      return <Loading />;
    }
  }

  //NOTE: Loading var is used to render spinner component at
  //the end of recent feed. Optional chaining is used to check
  //if data has arrived yet.
  let { loading, error, data } = useQuery(RECENTS);

  if (error) return `Error in Recent_Feed: ${error.message}`;

  return (
    <div
      className='recent-feed-container feed'
    >
      {data?.recents.map(plea => {
        return (
          <React.Fragment
            key={plea._id + bcrypt.hashSync('Recent Feed')}
          >
            <PleaShow plea={plea} />
          </React.Fragment>
        )
      })}
      {handleLoadingIcon()}
    </div>
  )
};

export default RecentFeed;