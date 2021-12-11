import React from 'react';
import { useQuery } from '@apollo/client';
import SympathyCountFilterParams from './Sympathy_Count_Filter_Params';
import TagFilterParams from './Tag_Filter_Params';
import TagFeedSortParams from './Tag_Feed_Sort_Params';
import Queries from '../../../graphql/queries.js';
const { FETCH_MAX_PARAMETER_FOR_FILTER } = Queries;

const HandleSetFilter = ({
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  lastObjectIdRef,
  fetchMoreBoolRef,
  tagFeed,
  tag
}) => {
  
  let { loading, error, data } = useQuery(FETCH_MAX_PARAMETER_FOR_FILTER, {
    variables: {
      tagId: tag?._id
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error in Handle_Set_Filter.js: ${error.message}`;
  
  const { fetchMaxParameterForFilter } = data;
  const { ceiling } = fetchMaxParameterForFilter;

  function handleTagFilterOrSort() {
    if (tagFeed) {
      return (
        <TagFeedSortParams
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
      )
    } else {
      return (
        <TagFilterParams 
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
      )
    };
  };

  return (
    <div
      className='filter-container'
    >
      <SympathyCountFilterParams
        filter={filter}
        setFilter={setFilter}
        initSliderVal={[0, ceiling]}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
      />
      {handleTagFilterOrSort()}
    </div>
  );
};

export default HandleSetFilter;