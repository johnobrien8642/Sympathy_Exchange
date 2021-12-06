import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Feed from '../dashboard/Feed';
import TagShow from './Tag_Show';
import HandleSetFilter from '../plea_shows/util_components/Handle_Set_Filter';
import Queries from '../../graphql/queries';
const { FETCH_TAG } = Queries;
 
const TagFeed = () => {
  let lastPleaSympathyCountRef = useRef(null);
  let lastObjectIdRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);
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
      <TagShow tag={tag} />
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
