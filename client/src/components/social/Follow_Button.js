import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Queries from '../../graphql/queries.js';
import Mutations from '../../graphql/mutations.js';
import UpdateCacheUtil from '../forms/util_functions/update_cache_util.js';
import doesUserFollow from '../forms/util_functions/does_user_follow.js';
const { FOLLOW, UNFOLLOW } = Mutations;
const { FETCH_USER } = Queries;
const { followUpdate, unfollowUpdate } = UpdateCacheUtil;

const FollowButton = ({
  feed,
  user,
  tag,
  currentUserId
}) => {
  let [follow] = useMutation(FOLLOW, {
    update(client, { data }) {
      var { follow } = data
      
      followUpdate(client, follow, FETCH_USER, currentUserId, user ? 'User' : 'Tag');
    },
    onError(error) {
      console.log(`Error in follow mutation: ${error.message}`)
    }
  });

  let [unfollow] = useMutation(UNFOLLOW, {
    update(client, { data }) {
      var { unfollow } = data
      
      unfollowUpdate(client, unfollow, FETCH_USER, currentUserId, user ? 'User' : 'Tag');
    },
    onError(error) {
      console.log(`Error in unfollow mutation: ${error.message}`)
    }
  });

  let { loading, error, data: currentUser } = useQuery(FETCH_USER, {
    variables: {
      userId: currentUserId
    }
  })

  if (loading) return 'Loading...';
  if (error) return `Error in Follow_Button.js: ${error.message}`;
  
  if (tag) {
    if (doesUserFollow(currentUser.user, user, tag)) {
      return (
        <React.Fragment>
          <button
            className='follow-btn'
            onClick={e => {
              e.preventDefault();
              unfollow({
                variables: {
                  currentUserArg: currentUserId,
                  item: user ? user._id : tag._id
                }
              })
            }}
          >
            Unfollow
          </button>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <button
            className='follow-btn'
            onClick={e => {
              e.preventDefault();
              follow({
                variables: {
                  currentUserArg: currentUserId,
                  item: user ? user._id : tag._id,
                  itemKind: user ? 'User' : 'Tag'
                }
              })
            }}
          >
            Follow
          </button>
        </React.Fragment>
      )
    }
  } else {
    if (currentUser.username !== user.username) {
      if (doesUserFollow(currentUser.user, user, tag)) {
        return (
          <React.Fragment>
            <button
              className='follow-btn'
              onClick={e => {
                e.preventDefault();
                unfollow({
                  variables: {
                    currentUserArg: currentUserId,
                    item: user ? user._id : tag._id
                  }
                })
              }}
            >
              Unfollow
            </button>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <button
              className='follow-btn'
              onClick={e => {
                e.preventDefault();
                follow({
                  variables: {
                    currentUserArg: currentUserId,
                    item: user ? user._id : tag._id,
                    itemKind: user ? 'User' : 'Tag'
                  }
                })
              }}
            >
              Follow
            </button>
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