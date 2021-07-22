import React from 'react';
import { useQuery } from '@apollo/client';

import Queries from '../../graphql/queries.js';
import Cookies from 'js-cookie';
const { FETCH_ACTIVITY_COUNTS } = Queries;

const ActivityCountIcon = ({
  cursorId
}) => {
  

  let { data } = useQuery(FETCH_ACTIVITY_COUNTS, {
    variables: {
      query: Cookies.get('currentUser'),
      cursorId: cursorId.toString()
    },
    pollInterval: 10000,
    fetchPolicy: 'network-only'
  })

  
  
  if (data) {
    if (data.fetchActivityCount) {
      if (data.fetchActivityCount > 0 && data.fetchActivityCount <= 99) {
        return (
          <div
            className='countAlertWrapperDiv'
            key={data.fetchActivityCount}
          >
            <div>
              <span
                className={
                  data.fetchActivityCount < 10 ? 
                  'oneThroughTen' : 
                  'elevenThroughNinetyNine'
                }
              >
                {data.fetchActivityCount}
              </span>
            </div>
          </div>
        )
      } else if (data.fetchActivityCount > 99) {
        return (
          <div
            className='countAlertWrapperDiv'
            key={data.fetchActivityCount}
          >
            <div>
              <span
                className={'greaterThanNinetyNine'}
              >
                99+
              </span>
            </div>
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

export default ActivityCountIcon;