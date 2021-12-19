import React, { useEffect } from 'react';
import Loading from '../../shared_util/Loading';
import { useQuery } from '@apollo/client';
import Queries from '../../../graphql/queries.js';
const { FETCH_ALL_TAGS } = Queries;

const TagFilterParams = ({
  tag,
  filter,
  setFilter,
  fetchMoreBoolRef,
  lastPleaSympathyCountRef
}) => {
  let { loading, error, data } = useQuery(FETCH_ALL_TAGS);

  if (loading) return 'Loading...';
  if (error) return `Error in Tag Filter Params: ${error.message}`;

  const { fetchAllTags } = data;
  
  if (loading) {
    return <Loading />;
  } else {
    return (
      <div
        className='tagFilterContainer'
      >
        {fetchAllTags.map(t => {
          return (
            <div
              className={(tag?._id === t._id || filter.tagIdArr.includes(t._id)) ? 'tag selected' : 'tag'}
              key={t._id}
              onClick={() => {
                const { floor, ceiling, tagIdArr, rangeArr, bySympCount, feedSort } = filter;
                let newArr;
                
                if (tag?._id === t._id) {
                  return
                } else {
                  if (tagIdArr.includes(t._id)) {
                    newArr =
                      tagIdArr.length === 1 ?
                      [] :
                      tagIdArr.filter(id => id !== t._id);
                      
                      setFilter({
                        floor: floor,
                        ceiling: ceiling,
                        rangeArr: rangeArr,
                        tagIdArr: newArr,
                        bySympCount: bySympCount,
                        byTagIds: newArr.length === 0 ? false : true,
                        feedSort: feedSort
                      });
                      
                      lastPleaSympathyCountRef.current = null;
                      fetchMoreBoolRef.current = true;
                  } else {
                    newArr = tagIdArr.concat(t._id);
                    
                    setFilter({
                      floor: floor,
                      ceiling: ceiling,
                      rangeArr: rangeArr,
                      tagIdArr: newArr,
                      bySympCount: bySympCount,
                      byTagIds: true,
                      feedSort: feedSort
                    });
    
                    lastPleaSympathyCountRef.current = null;
                    fetchMoreBoolRef.current = true;
                  }
                }
              }}
            >
              {t.title}
            </div>
          )
        })}
      </div>
    );
  }
};

export default TagFilterParams;
