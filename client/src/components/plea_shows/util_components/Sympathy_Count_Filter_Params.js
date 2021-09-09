import React, { useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import Queries from '../../../graphql/queries.js';
const { FETCH_MAX_PARAMETER_FOR_FILTER, FETCH_PLEA_FEED } = Queries;

const SympathyCountFilterParams = ({
  filter,
  setFilter,
  lastPleaSympathyCountRef,
  fetchMoreBoolRef
}) => {
  let selectedIndex = useRef(0);
  const client = useApolloClient();

  let { loading, error, data } = useQuery(FETCH_MAX_PARAMETER_FOR_FILTER);

  if (loading) return 'Loading...';
  if (error) return `Error in Sympathy Count Filter Params: ${error.message}`;

  const { fetchMaxParameterForFilter } = data;
  const { integerLength, ceiling } = fetchMaxParameterForFilter;
  
  let filterParamsArr = ['All'],
  zeroes = '0'.repeat(integerLength - 1);
    
  if (ceiling !== 1) {
    filterParamsArr.push(`0-1${'0'.repeat(integerLength - 1)}`)
    for (var i = 1; i < ceiling; i++) {
      let str = i.toString() + zeroes;
      filterParamsArr.push(str)
    };
  };

  return (
    <div
      className='sympathyCountFilterParamsContainer'
    >
      {filterParamsArr.map((str, i) => {
        return (
          <div
            className={selectedIndex.current === i ? 'sympathyCountParam selected' : 'sympathyCountParam'}
            key={i}
            onClick={() => {
              if (str === 'All') {
                selectedIndex.current = i;
                lastPleaSympathyCountRef.current = null;

                setFilter({
                  floor: null,
                  ceiling: null,
                  tagIdArr: filter.tagIdArr,
                  bySympCount: false,
                  byTagIds: filter.byTagIds
                });
              } else {
                selectedIndex.current = i;
                lastPleaSympathyCountRef.current = null;
                fetchMoreBoolRef.current = true;

                setFilter({
                  floor: parseInt(str),
                  ceiling: parseInt(
                    str.split('')[0] +
                    '9'.repeat(fetchMaxParameterForFilter.integerLength - 1)
                    ),
                    tagIdArr: filter.tagIdArr,
                    bySympCount: true,
                    byTagIds: filter.byTagIds
                });
              }
            }}
          >
            {str === 'All' ? str : `${str}s`}
          </div>
        )
      })}
    </div>
  )
};

export default SympathyCountFilterParams;