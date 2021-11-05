import React from 'react';
import { useQuery } from '@apollo/client';
import SympathyCountFilterParams from './Sympathy_Count_Filter_Params';
import TagFilterParams from './Tag_Filter_Params';
import Queries from '../../../graphql/queries.js';
const { FETCH_MAX_PARAMETER_FOR_FILTER } = Queries;

const Filter = ({
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  lastObjectIdRef,
  fetchMoreBoolRef
}) => {

  let { loading, error, data } = useQuery(FETCH_MAX_PARAMETER_FOR_FILTER);

  if (loading) return 'Loading...';
  if (error) return `Error in Sympathy Count Filter Params: ${error.message}`;

  const { fetchMaxParameterForFilter } = data;
  const { ceiling } = fetchMaxParameterForFilter;

  return (
    <div
      className='filterContainer'
    >
      <SympathyCountFilterParams
        filter={filter}
        setFilter={setFilter}
        initSliderVal={[0, ceiling]}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
      />
      <TagFilterParams 
        filter={filter}
        setFilter={setFilter}
        lastPleaSympathyCountRef={lastPleaSympathyCountRef}
        fetchMoreBoolRef={fetchMoreBoolRef}
      />
    </div>
  );
};

export default Filter;