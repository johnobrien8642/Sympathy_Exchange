const doesUserFollowUser = (
  currentUser,
  user,
  tag
) => {

  if (currentUser) {
    if (user) {
      return currentUser.userFollows.some(obj => obj._id === user._id)
    } else if (tag) {
      return currentUser.tagFollows.some(obj => obj._id === tag._id)
    }
  }
}

export default doesUserFollowUser;