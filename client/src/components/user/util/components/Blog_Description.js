import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import UserSettingsUtil from '../functions/user_settings_util.js'

import Queries from '../../../../graphql/queries.js';
import Mutations from '../../../../graphql/mutations.js';
const { FETCH_USER } = Queries;
const { UPDATE_USER_BLOG_DESCRIPTION } = Mutations;
const { blogDescriptionCache } = UserSettingsUtil;

const BlogDescription = ({
  mobile,
  userBlogDescription
}) => {
  let blogDescriptionRef = useRef(userBlogDescription)
  let [active, setActive] = useState(false);
  let [blogDescription, setBlogDescription] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessage, setError] = useState(null);

  useEffect(() => {
    var el = document.querySelector('.blogDescriptionTextarea')

    if (el) {
      el.textContent = userBlogDescription
    }
  
  }, [userBlogDescription])

  let [updateUserBlogDescription] = useMutation(UPDATE_USER_BLOG_DESCRIPTION, {
    update(client, { data }) {
      const { updateUserBlogDescription } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      blogDescriptionCache(client, updateUserBlogDescription, currentUser, query)
    },
    onCompleted(data) {
      console.log(data)
      blogDescriptionRef.current = data.updateUserBlogDescription.blogDescription
      resetInputs()
      setActive(active = false)
    },
    onError(error) {
      setError(errorMessage = error.message)
    }
  })

  const resetInputs = () => {
    setBlogDescription(blogDescription = '')
    setPassword(password = '')
    setError(errorMessage = '')
  }

  if (active) {
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          updateUserBlogDescription({
            variables: {
              blogDescription: blogDescription,
              password: password,
              user: Cookies.get('currentUser')
            }
          })
        }}
      >

        <div
          className='inputAndBtnContainer'
        >
          <textarea
            className='blogDescriptionTextarea'
            value={blogDescription}
            onChange={e => {
              setBlogDescription(blogDescription = e.target.value)
            }}
          />
          <span
            className='characterCount'
          >{150 - blogDescription.length} characters left</span>
          
          <p
            className='errMessage'
          >{errorMessage ? `${errorMessage}` : ''}</p>
          <input
            type='password'
            placeholder='Confirm password'
            value={password}
            onChange={e => {
              setPassword(password = e.target.value)
            }}
          />

          <div>
            <button
              className='cancel'
              type='button'
              onClick={() => {
                resetInputs()
                setActive(active = false)
              }}
            >Cancel</button>
            <button
              className='save'
              type='submit'
            >Save</button>
          </div>
        </div>
      </form>
    )
  } else {
    return (
      <div
        className='settingContainer'
      >
        <p>{blogDescriptionRef.current}</p>
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

export default BlogDescription;