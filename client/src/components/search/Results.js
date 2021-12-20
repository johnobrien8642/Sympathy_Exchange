import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import Loading from '../shared_util/Loading';
import UserResult from './result_types/User_Result';
import TagResult from './result_types/Tag_Result';
import PleaResult from './result_types/Plea_Result';
import Queries from '../../graphql/queries';
const { FETCH_SEARCH_RESULTS, CURRENT_USER_ID } = Queries;

const Results = ({
  user,
  searchInput, 
  active, 
  setActive
}) => {
  
  useEffect(() => {
    if (searchInput) {
      fetchSearch({
        variables: {
          searchInput: searchInput
        }
      });
    };
  }, [searchInput, ])
  
  let [fetchSearch, { loading, error, data }] = useLazyQuery(FETCH_SEARCH_RESULTS);

  if (error) return `Error in Results: ${error.message}`;
  
  if (loading) {
    return <Loading />;
  } else {
    return (
      <ul
        className='results'
        tabIndex='0'
      >
        {data?.fetchSearchResults.map((res, i) => {
          switch(res.__typename) {
            case 'UserType':
              return(
                <li
                  className='userResult'
                  key={res._id}
                >
                  <UserResult
                    currentUserId={user._id}
                    user={res}
                    active={active}
                    setActive={setActive}
                  />
                </li>
              )
            case 'TagType':
              return(
                <li
                  className='tagResult'
                  key={res._id}
                >
                  <TagResult
                    currentUserId={user._id}
                    tag={res}
                    active={active}
                    setActive={setActive}
                  />
                </li>
              )
            case 'PleaType':
              return(
                <li
                  className='plea-result'
                  key={res._id}
                >
                  <PleaResult
                    plea={res}
                    active={active}
                    setActive={setActive}
                  />
                </li>
              )
            default:
              return (
                <li></li>
              )
            }
        })}
      </ul>
    )
  }
}

export default Results;