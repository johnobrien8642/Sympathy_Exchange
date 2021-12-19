import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import Feed from './Feed';
import TagOrUserShow from './Tag_Or_User_Show';
import HandleSetFilter from '../plea_shows/util_components/Handle_Set_Filter';
import Queries from '../../graphql/queries';
const { FETCH_TAG } = Queries;
 
const TagFeed = ({match}) => {
  let lastPleaSympathyCountRef = useRef(null);
  let lastObjectIdRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);
  const params = useParams();
  const location = useLocation();
  const { tagId } = useParams();
  let [filter, setFilter] = useState({
    floor: null,
    ceiling: null,
    rangeArr: [],
    tagIdArr: [tagId],
    bySympCount: false,
    byTagIds: false,
    feedSort: 'bySympathyCount'
  });
  console.log(params)
  console.log(location.pathname.includes('tag-feed'))
  let { loading, error, data } = useQuery(FETCH_TAG, {
    variables: {
      tagId: tagId
    }
  })
  
  if (loading) return 'Loading...';
  if (error) return `Error in Tag_Feed: ${error.message}`;

  const { tag } = data;
  
  return (
    <div
      className='tag-feed-container'
    >
      <TagOrUserShow tag={tag} />
      <HandleSetFilter 
        filter={filter}
        setFilter={setFilter}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
        tagFeed={true}
        tag={tag}
      />
      <Feed
        filter={filter}
        tag={tag}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        lastObjectIdRef={lastObjectIdRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
      />
    </div>
  )
}

export default TagFeed;
