import React from 'react';
import { useQuery } from '@apollo/client';
import FollowedTags from './Followed_Tags_Result';
import Results from './Results';
import Queries from '../../graphql/queries.js'
const { FETCH_USER } = Queries;

const SearchDropDown = ({
  user,
  input,
  followedActive,
  active,
  setActive,
  currentUserId
}) => {

  let { loading, error, data } = useQuery(FETCH_USER, {
    variables: {
      userId: currentUserId
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;

  
  if (data) {
    if (active || followedActive) {
     return (
       <div
         className='searchDropDown'
       >
         <FollowedTags
           user={data.user}
           followedActive={followedActive}
         />
         <Results
           user={data.user}
           input={input} 
           active={active}
           setActive={setActive}
         />
       </div>
     )
   } else {
     return (
       <div>
       </div>
     )
   }
  }
};

export default SearchDropDown;