import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
import UpdateCacheUtil from '../../../posts/util/functions/update_cache_util.js';
const { filterPostContent } = UpdateCacheUtil;
const { ADD_FILTER_POST_CONTENT, DELETE_FILTER_POST_CONTENT } = Mutations;
const { FETCH_USER } = Queries;

const FilterPostContentInput = ({
  user
}) => {
  let [active, setActive] = useState(user.filteredPostContent.length > 0 ? true : false)
  let [postContent, setPostContent] = useState('')

  let [addFilterPostContent] = useMutation(ADD_FILTER_POST_CONTENT, {
    update(client, { data }) {
      const { addFilterPostContent } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      filterPostContent(client, addFilterPostContent, currentUser, query)
    },
    onCompleted() {
      setPostContent(postContent = '')
    }
  })

  let [deleteFilterPostContent] = useMutation(DELETE_FILTER_POST_CONTENT, {
    update(client, { data }) {
      const { deleteFilterPostContent } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      filterPostContent(client, deleteFilterPostContent, currentUser, query)
    },
    onCompleted() {
      setPostContent(postContent = '')
    }
  })

  if (active) {
    return (
      <React.Fragment>
        <form
          onSubmit={e => {
            e.preventDefault()
    
            addFilterPostContent({
                variables: {
                  postContent: postContent,
                  user: Cookies.get('currentUser')
                }
              })
            }}
          >
            <div
              className='filterTagInputContainer'
            >
              <input
                type='text'
                placeholder='Filter content'
                value={postContent}
                onChange={e => {
                  setPostContent(postContent = e.target.value)
                }}
              />
              <button
                type='submit'
                disabled={postContent ? false : true}
              >
                Add
              </button>
            </div>
          </form>
        <ul>
          {user.filteredPostContent.map((postContent, i) => {
            return (
              <li
                className='filteredTag'
                key={i}
              >
                <span>{postContent}</span>
                <button
                  type='button'
                  onClick={() => {
                    deleteFilterPostContent({
                      variables: {
                        postContent: postContent,
                        user: Cookies.get('currentUser')
                      }
                    })
                  }}
                >
                  Remove
                </button>
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    )
  } else {
    return (
      <div
        className='settingContainer'
      >
        <p>You're not filtering any post content</p>
        <img
          className='editPostBtn'
          src="https://img.icons8.com/windows/64/000000/edit--v1.png"
          alt=''
          onClick={() => {
            setActive(active = true)
          }}
        />
      </div>
    )
  }
}

export default FilterPostContentInput;