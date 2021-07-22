import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import PhotoPostOrRegisterPhotoInput from '../../../posts/util/components/forms/inputTypes/Photo_Post_Or_Register_Photo_Input';

import Queries from '../../../../graphql/queries';
import Mutations from '../../../../graphql/mutations.js';
import PostFormUtil from '../../../posts/util/functions/post_form_util.js';
import UserSettingsUtil from '../functions/user_settings_util.js'
const { handleFormData, mainPost } = PostFormUtil;
const { UPDATE_PROFILE_PIC } = Mutations;
const { FETCH_USER } = Queries;
const { updateCacheUpdateProfilePic } = UserSettingsUtil;

const EditProfilePic = ({
  user
}) => {
  let [active, setActive] = useState(false);
  let [profileImageFile, setProfileImageFile] = useState(null);
  let [password, setPassword] = useState('');
  let [errorMessage, setErrorMessage] = useState('');
  let [render, setRender] = useState(0);
  let previewProfilePicRef = useRef({});
  
  let iconUrls = {
    user: user.profilePic ? user.profilePic.src : null,
    default: "https://img.icons8.com/dusk/64/000000/kawaii-ice-cream.png"
  }

  useEffect(() => {
    if (iconUrls.user) {
      previewProfilePicRef.current.src = iconUrls.user
      previewProfilePicRef.current.alt = ''
    } else {
      previewProfilePicRef.current.src = iconUrls.default
      previewProfilePicRef.current.alt = ''
    }
  }, [iconUrls.user, iconUrls.default])

  let [updateProfilePic] = useMutation(UPDATE_PROFILE_PIC, {
    update(client, { data }) {
      const { updateProfilePic } = data;
      var currentUser = Cookies.get('currentUser')
      var query = FETCH_USER
      
      updateCacheUpdateProfilePic(client, updateProfilePic, currentUser, query)
    },
    onCompleted(data) {
      resetInputs()
      setActive(active = false)
    },
    onError(error) {
      setErrorMessage(errorMessage = `mutation error: ${error.message}`)
    }
  })
  
  const resetInputs = () => {
    previewProfilePicRef.current = {}
    setProfileImageFile(profileImageFile = null)
    setErrorMessage(errorMessage = '')
    setPassword(password = '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (profileImageFile) {
      var profileImageFormData = handleFormData(profileImageFile)
    }

    Promise.all([
      mainPost(profileImageFormData)
    ])
    .then(([mainUpload]) => {
      
      var instanceData = {
        profilePicId: mainUpload.length > 0 ? mainUpload[0]._id : null,
        password: password,
        user: Cookies.get('currentUser')
      }

      updateProfilePic({
        variables: {
          instanceData: instanceData
        }
      })
    })
  }

  if (active) {
    return (
      <form
        className='upload'
        onSubmit={e => {
          if (profileImageFile && password) {
            handleSubmit(e)
          } else {
            setErrorMessage(errorMessage = 'Please confirm your password')
          }
        }}
      >
        <PhotoPostOrRegisterPhotoInput
          register={true}
          edit={true}
          user={user}
          previewProfilePicRef={previewProfilePicRef}
          profileImageFile={profileImageFile}
          setProfileImageFile={setProfileImageFile}
          render={render}
          setRender={setRender}
        />

        <p
          className='errMessage'
        >{errorMessage ? `${errorMessage}` : ''}</p>

        <div
          className='inputAndBtnContainer'
        >
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
            >
              Cancel
            </button>
            <button
              className='save'
              type='submit'
            >
              Save
            </button>
          </div>
        </div>
      </form>
    )
  } else {
    return (
      <div
        className='currentProPic settingContainer'
      >
        <img
          className='profilePic'
          src={iconUrls.user ? iconUrls.user : iconUrls.default}
          alt=''
        />
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


export default EditProfilePic;