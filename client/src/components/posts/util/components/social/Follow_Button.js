import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../../../../graphql/queries.js';
import Mutations from '../../../../../graphql/mutations.js';
import UpdateCacheUtil from '../../../util/functions/update_cache_util.js';
import doesUserFollow from '../../functions/does_user_follow.js';
const { FOLLOW, UNFOLLOW } = Mutations;
const { FETCH_USER } = Queries;
const { followUpdate, unfollowUpdate } = UpdateCacheUtil;

const FollowButton = ({
  feed,
  user,
  tag,
}) => {
  let [follow] = useMutation(FOLLOW, {
    update(client, { data }) {
      var { follow } = data
      
      followUpdate(client, follow, FETCH_USER, Cookies.get('currentUser'), user ? 'User' : 'Tag')
    },
    onError(error) {
      console.log(error.message)
    }
  });

  let [unfollow] = useMutation(UNFOLLOW, {
    update(client, { data }) {
      var { unfollow } = data
      
      unfollowUpdate(client, unfollow, FETCH_USER, Cookies.get('currentUser'), user ? 'User' : 'Tag')
    },
    onError(error) {
      console.log(error.message)
    }
  });

  let { loading, error, data: currentUser } = useQuery(FETCH_USER, {
    variables: {
      query: Cookies.get('currentUser')
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error: ${error}`;

  if (tag) {
    if (doesUserFollow(currentUser.user, user, tag)) {
      return (
        <React.Fragment>
          <form
            onSubmit={e => {
              e.preventDefault();
              unfollow({
                variables: {
                  user: Cookies.get('currentUser'),
                  item: user ? user._id : tag._id
                }
              })
            }}
          >
            <button type='submit'>Unfollow</button>
          </form>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <form
            onSubmit={e => {
              e.preventDefault();
              follow({
                variables: {
                  user: Cookies.get('currentUser'),
                  item: user ? user._id : tag._id,
                  itemKind: user ? 'User' : 'Tag'
                }
              })
            }}
          >
            <button type='submit'>Follow</button>
          </form>
        </React.Fragment>
      )
    }
  } else {
    if (currentUser.user.blogName !== user.blogName) {
      if (doesUserFollow(currentUser.user, user, tag)) {
        return (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault();
                unfollow({
                  variables: {
                    user: Cookies.get('currentUser'),
                    item: user ? user._id : tag._id
                  }
                })
              }}
            >
              <button type='submit'>Unfollow</button>
            </form>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <form
              onSubmit={e => {
                e.preventDefault();
                follow({
                  variables: {
                    user: Cookies.get('currentUser'),
                    item: user ? user._id : tag._id,
                    itemKind: user ? 'User' : 'Tag'
                  }
                })
              }}
            >
              <button type='submit'>Follow</button>
            </form>
          </React.Fragment>
        )
      }
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default FollowButton;