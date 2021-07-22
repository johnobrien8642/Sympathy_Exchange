import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import Feed from './Feed.js';
import TagShow from './Tag_Show';

import Queries from '../../graphql/queries';
const { FETCH_TAG } = Queries;
 
const TagFeed = () => {
  let { tagTitle } = useParams();
  var hashedTitle = "#" + tagTitle

  let { loading, error, data } = useQuery(FETCH_TAG, {
    variables: {
      query: hashedTitle
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  var { tag } = data;
  
  return (
    <div
      className='tagFeedContainer'
    >
      <TagShow tag={tag} />
      <Feed tag={tag} />
    </div>
  )
}

export default TagFeed;
