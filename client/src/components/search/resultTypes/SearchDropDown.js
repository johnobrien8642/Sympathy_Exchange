import React from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import FollowedTags from './Followed_Tags_Result';
import Results from '../Results';

import Queries from '../../../graphql/queries.js'
const { FETCH_USER } = Queries;

const SearchDropDown = ({
  user,
  followedActive,
  input,
  active,
  setActive
}) => {

  let { data } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

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