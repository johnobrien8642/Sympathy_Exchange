const postCreate = (
  client, 
  createPost,
  currentUser, 
  query
) => {
  var readQuery = client.readQuery({
    query: query,
    variables: {
      query: currentUser
    }
  })
  
  var { fetchUserFeed } = readQuery;
  
  var newPostArr = [{ __typename: 'createPost' }, createPost, ...fetchUserFeed]
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      fetchUserFeed: newPostArr
    }
  })
}

const postUpdate = (
  client, 
  updatePost,
  currentUser, 
  query
) => {
  var readQuery = client.readQuery({
    query: query,
    variables: {
      query: currentUser
    }
  })
  
  var { fetchUserFeed } = readQuery;
  
  var newPostArr = [...fetchUserFeed]
  
  fetchUserFeed.forEach((p, i) => {
    if (updatePost._id === p._id) {
      newPostArr.splice(i, 1, updatePost)
    }
  })
  
  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      fetchUserFeed: newPostArr
    }
  })
}

const commentPost = (
  client,
  comment,
  post,
  query
) => {
  var readFeed = client.readQuery({
    query: query,
    variables: {
      postId: post._id
    }
  })
  
  var { fetchLikesRepostsAndComments } = readFeed;

  var newPostArr = [...fetchLikesRepostsAndComments, comment]
  
  client.writeQuery({
    query: query,
    variables: {
      postId: post._id
    },
    data: {
      fetchLikesRepostsAndComments: newPostArr
    }
  })
}

const postDelete = (
  client, 
  post, 
  deletePost,
  currentUser, 
  query
) => {
  var readFeed = client.readQuery({
    query: query,
    variables: {
      query: currentUser
    }
  })

  var { fetchUserFeed } = readFeed;
  
  var newPostArr = fetchUserFeed.filter(post1 => post1._id !== post._id)

  client.writeQuery({
    query: query,
    variables: {
      query: currentUser
    },
    data: {
      fetchUserFeed: [{ __typename: 'deletePost' }, ...newPostArr]
    }
  })
}

const postLike = (
  client, 
  likePost,
  post, 
  query
) => {
  
  var readFeed = client.readQuery({
    query: query,
    variables: {
      postId: post._id
    }
  })
  
  var { fetchLikesRepostsAndComments } = readFeed;
  
  var newPostArr = [...fetchLikesRepostsAndComments, likePost]
  
  client.writeQuery({
    query: query,
    variables: {
      postId: post._id
    },
    data: {
      fetchLikesRepostsAndComments: newPostArr
    }
  })
}

const postUnlike = (
  client, 
  unlikePost,
  post, 
  liked, 
  query
) => {

  var readFeed = client.readQuery({
    query: query,
    variables: {
      postId: post._id
    }
  })
  
  var { fetchLikesRepostsAndComments } = readFeed;
  
  var newPostArr = fetchLikesRepostsAndComments.filter(item => {
      if (item._id === liked._id) {
        return false
      } else {
        return true
      }
    }
  )
  
  client.writeQuery({
    query: query,
    variables: {
      postId: post._id
    },
    data: {
      fetchLikesRepostsAndComments: newPostArr
    }
  })
}

const filterTag = (
  client, 
  addFilterTag,
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
        filteredTags: addFilterTag.filteredTags
      }
    }
  })
}

const filterPostContent = (
  client, 
  addFilterPostContent,
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
        filteredTags: addFilterPostContent.filteredPostContent
      }
    }
  })
}

const followUpdate = (
  client, 
  follow,
  gqlQuery, 
  query,
  kind
) => {
  var readFeed = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query
    }
  })
  
  var { user } = readFeed;

  var newArr = kind === 'User' ? 
  [...user.userFollows, follow._id] : 
  [...user.tagFollows, follow._id]

  if (kind === 'User') {
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query
      },
      data: {
        user: {
          userFollows: newArr
        }
      }
    })
  } else {
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query
      },
      data: {
        user: {
          tagFollows: newArr
        }
      }
    })
  }
}

const unfollowUpdate = (
  client, 
  unfollow,
  gqlQuery, 
  query,
  kind
) => {
  var readFeed = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query
    }
  })
  
  var { user } = readFeed;

  var newArr = kind === 'User' ? 
  user.userFollows.filter(obj => obj._id !== unfollow._id) : 
  user.tagFollows.filter(obj => obj._id !== unfollow._id)

  if (kind === 'User') {
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query
      },
      data: {
        user: {
          userFollows: newArr
        }
      }
    })
  } else {
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query
      },
      data: {
        user: {
          tagFollows: newArr
        }
      }
    })
  }
}

const UpdateCacheUtil = {
  postCreate, 
  postUpdate,
  commentPost,
  postDelete,
  postLike, 
  postUnlike,
  filterTag,
  filterPostContent,
  followUpdate,
  unfollowUpdate
}

export default UpdateCacheUtil