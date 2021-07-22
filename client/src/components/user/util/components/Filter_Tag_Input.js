import React, { useState } from 'react'
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
import UpdateCacheUtil from '../../../posts/util/functions/update_cache_util.js';
const { filterTag } = UpdateCacheUtil;
const { ADD_FILTER_TAG, DELETE_FILTER_TAG } = Mutations;
const { FETCH_USER } = Queries;


const FilterTagInput = ({
  mobile,
  user
}) => {
  let [tag, setTag] = useState('')
  let [active, setActive] = useState(user.filteredTags.length > 0 ? true : false)
  let [addFilterTag] = useMutation(ADD_FILTER_TAG, {
    update(client, { data }) {
      const { addFilterTag } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      filterTag(client, addFilterTag, currentUser, query)
    },
    onCompleted() {
      setTag(tag = '')
    }
  })

  let [deleteFilterTag] = useMutation(DELETE_FILTER_TAG, {
    update(client, { data }) {
      const { deleteFilterTag } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      filterTag(client, deleteFilterTag, currentUser, query)
    },
    onCompleted() {
      setTag(tag = '')
    }
  })

  if (active) {
    return (
      <React.Fragment>
        <form
        onSubmit={e => {
          e.preventDefault()    
          addFilterTag({
              variables: {
                tag: tag,
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
              placeholder='Filter a tag'
              value={tag}
              onChange={e => {
                setTag(tag = e.target.value)
              }}
            />
            <button
              className='addBtn'
              type='submit'
              disabled={tag ? false : true}
            >
              Add
            </button>
          </div>
        </form>
        <ul>
          {user.filteredTags.map((tag, i) => {
            return (
              <li
                className='filteredTag'
                key={tag._id}
              >
                <span>{tag}</span>
                <button
                  type='button'
                  onClick={() => {
                    deleteFilterTag({
                      variables: {
                      tag: tag,
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
        <p>You're not filtering any tags</p>
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

export default FilterTagInput;