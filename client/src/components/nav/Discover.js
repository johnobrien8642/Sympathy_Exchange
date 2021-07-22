import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import RecommendedTags from '../nav/Recommended_Tags';
import DiscoverFeed from '../feeds/Discover_Feed';
import FollowedTags from '../search/resultTypes/Followed_Tags_Result';

import Queries from '../../graphql/queries.js';
const { FETCH_RECOMMENDED_TAGS, FETCH_USER } = Queries;

const Discover = () => {
  let [tag, setTag] = useState(null)
 
  let { loading: loading1, error: error1, data: recTags } = useQuery(FETCH_RECOMMENDED_TAGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  let { loading: loading2, error: error2, data: user } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading1 || loading2) return 'Loading...';
  if (error1) return `recommended Error: ${error1}`;
  if (error2) return `user Error: ${error2}`;
  
  return (
    <div
      className='discoverContainer'
    >
      <div
        className='discoverTagsHeader'
      >
        <RecommendedTags
          recTags={recTags.fetchRecommendedTags}
          tag={tag}
          setTag={setTag}
        />
        
      </div>

      <DiscoverFeed
        currentUser={user.user}
      />

      <div
        className='followedTagsContainer'
      >
        <FollowedTags
          user={user.user}
          followedActive={true}
          discover={true}
        />
      </div>
    </div>
  )
}

export default Discover;