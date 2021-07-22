import React from 'react';
import { useQuery } from '@apollo/client';

import UserResult from './resultTypes/User_Result';
import TagResult from './resultTypes/Tag_Result';

import Queries from '../../graphql/queries';
const { SEARCH_USERS_AND_TAGS } = Queries;

const Results = ({
  user,
  input, 
  active, 
  setActive 
}) => {
  
  let { data } = useQuery(SEARCH_USERS_AND_TAGS,
      { variables: {
        filter: { OR: [
            { blogName_contains: input },
            { tag_title_contains: input }
          ]
        }
      }
    }
  );
  
  if (data) {
    
    const { usersAndTags } = data;

    if (usersAndTags) {
      if (active) {
        return (
          <ul
            className='results'
            tabIndex='0'
          >
            {usersAndTags.map((res, i) => {
              switch(res.__typename) {
                case 'UserType':
                  return(
                    <li
                      className='userResult'
                      key={res._id}
                    >
                      <UserResult
                        currentUser={user}
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
                        currentUser={user}
                        tag={res}
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
      } else {
        return (
          <div>
          </div>
        )
      }
    } else {
      return (
        <div>
        </div>
      )
    }
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default Results;