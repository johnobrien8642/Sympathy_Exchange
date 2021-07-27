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

const updateCacheUpdateUsername = (
  client, 
  updateUsername,
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
        username: updateUsername.username
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
  updateCacheUpdateUsername,
  blogDescriptionCache
}

export default UserSettingsUtil;