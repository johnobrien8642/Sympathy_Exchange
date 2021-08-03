import React from 'react';
import TagResult from '../../../search/resultTypes/Tag_Result';
import UserResult from '../../../search/resultTypes/User_Result';

const header = (user, tag) => {
  if (user) {
    return (
      <UserResult user={user} />
    )
  } else if (tag) {
    return (
      <TagResult tag={tag} />
    )
  }
}

const infiniteScroll = (
  client,
  updateCacheFunc,
  query, 
  gqlQuery,
  cursorId,
  fetchMoreDiv,
  fetchMoreDivId
) => {

  return document.addEventListener('scroll', function(event) {
    fetchMoreDiv.current = document.querySelector(fetchMoreDivId.current)
      if (fetchMoreDiv.current) {
        var el = fetchMoreDiv.current.getBoundingClientRect()
        var elTop = el.top
        var elBottom = el.bottom
        var innerHeight = window.innerHeight
        
        if (elTop >= 0 && elBottom <= innerHeight) {
          client.query({
            query: gqlQuery.current,
            variables: {
              query: query.current,
              cursorId: cursorId.current
            },
            fetchPolicy: 'no-cache'
            
          }).then(res => {
            if (res.loading) return 'Loading...';
              updateCacheFunc(
                res, client, query.current,
                gqlQuery.current, cursorId
              )
          })
        }
      }
    })
}

const handlePostNotesScrollOutOfWindow = (
  notesActive,
  setNotesActive
) => {
  return document.addEventListener('scroll', function(event) {
    var node = document.querySelector('.postNotes')
    if (node) {
      var el = node.getBoundingClientRect(),
      elTop = el.top,
      elBottom = el.bottom,
      innerHeight = window.innerHeight
      
      if (elTop > innerHeight + 10 || elBottom < -10) {
        setNotesActive(notesActive = false)
      }
    }
  })
}

const updateCacheInfScroll = (
  res, 
  client, 
  query, 
  gqlQuery, 
  cursorId
) => {
  
  var readFeed  = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query,
      cursorId: cursorId.current
    },
  })
  
  if (readFeed) {
    var { fetchTagFeed, fetchUserFeed, 
          fetchAllUserActivity } = readFeed;
  }
  
  var newData
  var oldArr
  var newArr
  if (fetchTagFeed) {
    oldArr = fetchTagFeed
    newData = res.data.fetchTagFeed
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchTagFeed: newArr
      }
    })
  } else if (fetchUserFeed) {
    oldArr = fetchUserFeed
    newData = res.data.fetchUserFeed
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchUserFeed: newArr
      }
    })
  } else if (fetchAllUserActivity) {
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchAllUserActivity: newArr
      }
    })
  } else if (fetchAllUserActivity) {
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity
    newArr = [...oldArr, ...newData]

    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchAllUserActivity: newArr
      }
    })
  }
  
  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const updateCacheInfScrollActivity = (
  res, 
  client, 
  query, 
  gqlQuery, 
  cursorId
) => {
  
  var readFeed  = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query,
      cursorId: cursorId.current
    },
  })
  
  if (readFeed) {
    var { fetchAllUserActivity } = readFeed;
  }

  var oldArr
  var newData
  
  if (fetchAllUserActivity) {
    console.log(fetchAllUserActivity)
    oldArr = fetchAllUserActivity
    newData = res.data.fetchAllUserActivity

    var newArr = [...oldArr, ...newData]
    
    if (fetchAllUserActivity) {
      client.writeQuery({
        query: gqlQuery,
        variables: {
          query: query,
          cursorId: cursorId.current
        },
        data: {
          fetchAllUserActivity: newArr
        }
      })
    }
    
    if (newData) {
      cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
    }
  }
}

const updateCacheInfScrollUserFollowers = (
  res, 
  client, 
  query, 
  gqlQuery, 
  cursorId
) => {
  
  var readFeed  = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query,
      cursorId: cursorId.current
    },
  })
  
  if (readFeed) {
    var { fetchUserFollowers } = readFeed;
  }

  var oldArr
  var newData
  var newArr
  if (fetchUserFollowers) {
    oldArr = fetchUserFollowers
    newData = res.data.fetchUserFollowers
    newArr = [...oldArr, ...newData]
    
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchUserFollowers: newArr
      }
    })
  }

  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const updateCacheInfScrollFollowedUsers = (
  res, 
  client, 
  query, 
  gqlQuery, 
  cursorId
) => {
  
  var readFeed  = client.readQuery({
    query: gqlQuery,
    variables: {
      query: query,
      cursorId: cursorId.current
    },
  })
  
  if (readFeed) {
    var { fetchFollowedUsers } = readFeed;
  }

  var oldArr
  var newData
  var newArr
  
  if (fetchFollowedUsers) {
    oldArr = fetchFollowedUsers
    newData = res.data.fetchFollowedUsers
    newArr = [...oldArr, ...newData]
    
    client.writeQuery({
      query: gqlQuery,
      variables: {
        query: query,
        cursorId: cursorId.current
      },
      data: {
        fetchFollowedUsers: newArr
      }
    })
  }

  if (newData) {
    cursorId.current = newData.length > 0 ? newData[newData.length - 1]._id : null
  }
}

const handleData = (data, feedArr, cursorId, endOfPosts) => {
  var { fetchUserFeed,
        fetchUserBlogFeed,
        fetchTagFeed,
        fetchAllUserActivity,
        fetchUserFollowers,
        fetchFollowedUsers,
        fetchUserLikes } = data

  if (fetchUserFeed) {
    feedArr.current = fetchUserFeed
  } else if (fetchUserBlogFeed) {
    feedArr.current = fetchUserBlogFeed
  } else if (fetchTagFeed) {
    feedArr.current = fetchTagFeed
  } else if (fetchAllUserActivity) {
    var arr = [...fetchAllUserActivity]
    arr.sort((a, b) => b.createdAt - a.createdAt)
    feedArr.current = arr
  } else if (fetchUserFollowers) {
    feedArr.current = fetchUserFollowers
  } else if (fetchFollowedUsers) {
    feedArr.current = fetchFollowedUsers
  } else if (fetchUserLikes) {
    feedArr.current = fetchUserLikes
  } else if (fetchFollowedUsers) {
    feedArr.current = fetchFollowedUsers
  } else if (fetchUserFollowers) {
    feedArr.current = fetchUserFollowers
  }
  
  endOfPosts.current = feedArr.current.length === 0 ? true : false
  if (feedArr.current.length > 0) {
    cursorId.current = feedArr.current[feedArr.current.length - 1]._id
  }
}

const setgqlQueryAndQueryFeed = (
  tag, 
  user, 
  userLikes,
  gqlQuery, 
  query,
  FETCH_TAG_FEED,
  FETCH_USER_BLOG_FEED,
  FETCH_USER_LIKES,
  currentUser
) => {

  if (tag) {
    query.current = tag.title.slice(1)
    gqlQuery.current = FETCH_TAG_FEED
  } else if (user) {
    query.current = user.blogName
    gqlQuery.current = FETCH_USER_BLOG_FEED
  } else if (userLikes) {
    query.current = currentUser
    gqlQuery.current = FETCH_USER_LIKES
  } else {
    query.current = currentUser
  }
}

const setgqlQueryUserFollowedOrFollowingOrActivity = (
  historyParam,
  gqlQuery,
  FETCH_USER_FOLLOWERS,
  FETCH_FOLLOWED_USERS,
  FETCH_ALL_ACTIVITY
) => {

  if (historyParam === '/followers') {
    gqlQuery.current = FETCH_USER_FOLLOWERS
  } else if (historyParam === '/following') {
    gqlQuery.current = FETCH_FOLLOWED_USERS
  } else if (historyParam === '/activity') {
    gqlQuery.current = FETCH_ALL_ACTIVITY
  }
}



const FeedUtil = { 
  header, updateCacheInfScroll,
  infiniteScroll,
  updateCacheInfScrollActivity,
  updateCacheInfScrollUserFollowers,
  updateCacheInfScrollFollowedUsers,
  handlePostNotesScrollOutOfWindow,
  handleData, setgqlQueryAndQueryFeed,
  setgqlQueryUserFollowedOrFollowingOrActivity
  // doesUserFollowUser
}

export default FeedUtil;