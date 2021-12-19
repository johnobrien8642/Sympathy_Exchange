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
                let newArr;
                
                if (tag?._id === t._id) {
                  return
                } else {
                  if (filter.tagIdArr.includes(t._id)) {
                    let newObj = {...filter};
                    newArr =
                      newObj.tagIdArr.length === 1 ?
                      [] :
                      newObj.tagIdArr.filter(id => id !== t._id);
                    newObj.tagIdArr = newArr;
                    newObj.byTagIds = !!newArr.length;
                    setFilter(newObj);
                      
                    lastPleaSympathyCountRef.current = null;
                    fetchMoreBoolRef.current = true;
                  } else {
                    newArr = [...filter.tagIdArr, t._id];
                    let newObj = {...filter};
                    newObj.tagIdArr = newArr;
                    newObj.byTagIds = true;
                    setFilter(newObj);
    
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
