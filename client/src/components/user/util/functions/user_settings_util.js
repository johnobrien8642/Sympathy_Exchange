const updateCacheUpdateProfilePic = (
  client, 
  updateProfilePic,
  currentUser, 
  query
) => {
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      user: {
        profilePic: {
          _id: updateProfilePic.profilePic._id,
          src: updateProfilePic.profilePic.src
        }
      }
    }
  })
}

const updateCacheUpdateEmail = (
  client, 
  updateUserEmail,
  currentUser, 
  query
) => {
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      user: {
        email: updateUserEmail.email
      }
    }
  })
}


const blogDescriptionCache = (
  client, 
  updateUserBlogDescription,
  currentUser, 
  query
) => {
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      user: {
        blogDescription: updateUserBlogDescription.blogDescription
      }
    }
  })
}

const UserSettingsUtil = {
  updateCacheUpdateProfilePic,
  updateCacheUpdateEmail,
  blogDescriptionCache
}

export default UserSettingsUtil;