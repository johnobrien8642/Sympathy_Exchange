import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import UserResult from '../../search/resultTypes/User_Result';

import Queries from '../../../graphql/queries.js';
const { FETCH_CHECK_OUT_THESE_BLOGS } = Queries;

const CheckOutTheseBlogs = () => {

  useEffect(() => {

    return () => {
      refetch()
    }
  })

  let { loading, error, data, refetch } = useQuery(FETCH_CHECK_OUT_THESE_BLOGS, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  const { fetchCheckOutTheseBlogs } = data;
  
  return (
    <div
      className='checkOutTheseBlogs'
    >
      <h1>Check out these blogs</h1>
      {fetchCheckOutTheseBlogs.map(user => {
        return (
          <div
            key={user._id}
          >
            <UserResult user={user} checkOutTheseBlogs={true} />
          </div>
        )
      })}
      <Link
        className='explore'
        to='/discover'
      >
        Explore all of Rumblr
      </Link>
    </div>
  )
}

export default CheckOutTheseBlogs;