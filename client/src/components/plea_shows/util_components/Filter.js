import React from 'react';
import { useQuery } from '@apollo/client';
import Queries from '../../../graphql/queries.js';
const { FETCH_MAX_PARAMETER_FOR_FILTER } = Queries;

const Filter = ({
  filter,
  setFilter
}) => {
  let { loading, error, data } = useQuery(FETCH_MAX_PARAMETER_FOR_FILTER);

  if (loading) return 'Loading...';
  if (error) return `Error in Filter Main Page: ${error.message}`;

  const { fetchMaxParameterForFilter } = data;

  const renderFilterParameters = (params) => {
    const { integerLength, ceiling } = params;
    let filterParamsArr = ['All'],
    zeroes = '0'.repeat(integerLength - 1);
    
    if (ceiling !== 1) {
      filterParamsArr.push(`0-1${'0'.repeat(integerLength - 1)}`)
      for (var i = 1; i < ceiling + 1; i++) {
        let str = i.toString() + zeroes;
        filterParamsArr.push(str)
      }
    }

    return (
      <div
        className='filterParamsContainer'
      >
        {filterParamsArr.map((str, i) => {
          return (
            <div
              className='filterParam'
              key={i}
              onClick={() => {
                if (str === 'All') {
                  setFilter({
                    floor: null,
                    ceiling: null,
                    bySympCount: false,
                    byTagIds: filter.byTagIds
                  })
                } else {
                  setFilter({
                    floor: parseInt(str),
                    ceiling: parseInt(
                      str.split('')[0] + 
                      '9'.repeat(fetchMaxParameterForFilter.integerLength - 1)
                    ),
                    bySympCount: true,
                    byTagIds: filter.byTagIds
                  })
                }
              }}
            >
              {str === 'All' ? str : `${str}s`}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {renderFilterParameters(fetchMaxParameterForFilter)}  
    </div>
  );
};

export default Filter;