import React from 'react';
import { useQuery } from '@apollo/client';
import Loading from '../../shared_util/Loading';
import SympathyCountFilterParams from './Sympathy_Count_Filter_Params';
import TagFilterParams from './Tag_Filter_Params';
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

  if (error) return `Error in Handle_Set_Filter.js: ${error.message}`;

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div
        className='filter-container'
      >
        <SympathyCountFilterParams
          filter={filter}
          setFilter={setFilter}
          initSliderVal={[0, data?.fetchMaxParameterForFilter.ceiling]}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
        <TagFilterParams
          tag={tag}
          filter={filter}
          setFilter={setFilter}
          lastPleaSympathyCountRef={lastPleaSympathyCountRef}
          fetchMoreBoolRef={fetchMoreBoolRef}
        />
      </div>
    );
  }
};

export default HandleSetFilter;