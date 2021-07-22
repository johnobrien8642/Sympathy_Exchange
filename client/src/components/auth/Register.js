import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import PhotoPostOrRegisterPhotoInput from '../posts/util/components/forms/inputTypes/Photo_Post_Or_Register_Photo_Input';

import Queries from '../../graphql/queries';
import Mutations from '../../graphql/mutations';
import PostFormUtil from '../posts/util/functions/post_form_util.js';
const { REGISTER_USER } = Mutations;
const { IS_LOGGED_IN } = Queries;
const { mainPost, 
        handleFormData } = PostFormUtil;


const Register = () => {
  let previewProfilePicRef = useRef({});
  let [profileImageFile, setProfileImageFile] = useState([]);
  let [email, setEmail] = useState('');
  let [blogName, setBlogName] = useState('');
  let [blogDescription, setBlogDescription] = useState('');
  let [password, setPassword] = useState('');
  let [errorMessages, addErrorMessage] = useState([]);
  let history = useHistory();

  const [ registerUser ] = useMutation(REGISTER_USER, {
    onError(error) {
      if(error.message === 'Account already exists with that email') {
        history.push({
          pathname: '/login',
          state: {
            errMessage: error.message
          }
        })
      } else {
        addErrorMessage(errorMessages = [])
        error.graphQLErrors.forEach((error, i) => {
          addErrorMessage(errorMessages.concat(error.message))
        })
      }
    },
    onCompleted({ registerUser }) {
      const { token, blogName } = registerUser;
      Cookies.set('auth-token', token)
      Cookies.set('currentUser', blogName)
      resetInputs();
      window.location.reload();
    },
    update(client, { data }) {
      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: data.registerUser.loggedIn,
        }
      })
    }
  })

  const resetInputs = () => {
    setEmail(email = '');
    setBlogName(blogName = '');
    setPassword(password = '');
    addErrorMessage(errorMessages = []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    var mainImageFormData = handleFormData(profileImageFile)

    Promise.all([
      mainPost(mainImageFormData)
    ])
    .then(([mainUpload]) => {
      
      var instanceData = {
        profilePicId: mainUpload[0] ? mainUpload[0]._id : null,
        email: email, 
        blogName: blogName,
        password: password,
        blogDescription: blogDescription
      }

      registerUser({ 
        variables: {
          instanceData: instanceData
        }
      })
    })
  }

  return (
    <div
      className='registerForm'
    >
      <div
        className='greetingHeader'
      >
        <h1>Rumblr</h1>
      </div>

        <form
          onSubmit={e => {
            handleSubmit(e)
          }}
        >

        <PhotoPostOrRegisterPhotoInput 
          register={true}
          previewProfilePicRef={previewProfilePicRef}
          profileImageFile={profileImageFile}
          setProfileImageFile={setProfileImageFile}
        />

        <ul
          className='authErrors'
        >
          {errorMessages.map((error, i) => {
            return <li key={i}>{error}</li>
          })}
        </ul>

        <input
          type='text'
          value={email}
          placeholder={'Email'}
          onChange={e => setEmail(email = e.target.value)}
        />
        <input
          type='text'
          value={blogName}
          placeholder={'Blog Name'}
          onChange={e => setBlogName(blogName = e.target.value)}
        />
        <textarea
          value={blogDescription}
          placeholder={'Blog description'}
          onChange={e => {
            if (blogDescription.length < 150) {
              setBlogDescription(blogDescription = e.target.value)
            } 
          }}
        ></textarea>
        <span>{150 - blogDescription.length} characters left</span>
        

        <input
          type='password'
          value={password}
          placeholder={'Password'}
          onChange={e => setPassword(password = e.target.value)}
        />

        <button 
          type='submit'
        >
          Sign up
        </button>

        <Link
          to='/login'
        >
          Already have an account? Log in!
        </Link>
      </form>
    </div>
  )
}

export default Register;