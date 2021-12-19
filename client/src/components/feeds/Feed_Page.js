import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';
import TagOrUserShow from './Tag_Or_User_Show';
import Loading from '../shared_util/Loading';
import Feed from './Feed';
import RecentFeed from './Recent_Feed';
import HandleSetFilter from '../plea_shows/util_components/Handle_Set_Filter';
import Queries from '../../graphql/queries.js';
const { FETCH_TAG, FETCH_USER } = Queries;

const FeedPage = () => {
  let [filter, setFilter] = useState({
    floor: null,
    ceiling: null,
    rangeArr: [],
    tagIdArr: [],
    bySympCount: false,
    byTagIds: false,
    feedSort: 'bySympathyCount'
  });
  let lastPleaSympathyCountRef = useRef(null);
  let lastObjectIdRef = useRef(null);
  let fetchMoreBoolRef = useRef(false);
  const { tagId, userId } = useParams();
  const { pathname } = useLocation();
  const feedType = {
    isTag: pathname.includes('tag-feed'),
    isUser: pathname.includes('user-feed'),
    isMain: pathname.includes('main-feed')
  }
  
  let { loading: tagLoading, error: tagError, data: tagData } = useQuery(FETCH_TAG, {
    variables: {
      tagId: tagId
    }
  });

  let { loading: userLoading, error: userError, data: userData } = useQuery(FETCH_USER, {
    variables: {
      userId: userId
    }
  });
  
  function handleTagOrUserShow(tagData, userData) {
    const { isTag, isUser } = feedType;
    if (isTag || isUser) {
      return <TagOrUserShow tag={tagData?.tag} user={userData?.user} />;
    }
  }

  if (tagError || userError) return `${tagError ? 'Tag Error' : 'User Error'} in Feed_Page: ${tagError?.message || userError.message}`;

  if (tagLoading || userLoading) {
    return <Loading />;
  } else {
    return(
      <div
        className='main-feed-page-container'
      >
        <div
          className='col-1'
        >
          <HandleSetFilter
            tag={tagData ? tagData.tag : null}
            filter={filter}
            setFilter={setFilter}
            lastPleaSympathyCountRef={lastPleaSympathyCountRef}
            lastObjectIdRef={lastObjectIdRef}
            fetchMoreBoolRef={fetchMoreBoolRef}
          />
        </div>
        <div
          className='col-2'
        >
          {handleTagOrUserShow(tagData, userData)}
          <Feed
            tag={tagData?.tag}
            user={userData?.user}
            filter={filter}
            setFilter={setFilter}
            lastPleaSympathyCountRef={lastPleaSympathyCountRef}
            lastObjectIdRef={lastObjectIdRef}
            fetchMoreBoolRef={fetchMoreBoolRef}
          />
        </div>
        <div
          className='col-3'
        >
          <RecentFeed />
        </div>
      </div>
    )
  }
};

export default FeedPage;