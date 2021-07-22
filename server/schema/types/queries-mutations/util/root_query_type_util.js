//filter regex

const handleFilterTagRegex = (user) => {
  var regexStr
  if (user.filteredTags.length > 1) {
    regexStr = user.filteredTags.join('|')
    return new RegExp(regexStr, 'gm')
  } else if (user.filteredTags.length === 1) {
    return new RegExp(user.filteredTags[0], 'gm')
  }
}

const handleFilterPostContentRegex = (user) => {
  var regexStr
  if (user.filteredPostContent.length > 1) {
    regexStr = user.filteredPostContent.join('|')
    return new RegExp(regexStr, 'gm')
  } else if (user.filteredPostContent.length === 1) {
    return new RegExp(user.filteredPostContent[0], 'gm')
  }
}

//all tag post feed

const asyncTagPostArr = async (
    query, 
    tags, 
    likedPostIds, 
    Post,
    User, 
    mongoose,
    asyncFetchTagPosts,
    handleFilterTagRegex,
    handleFilterPostContentRegex
  ) => {

  var tagPosts = []
  for (var i = 0; i < tags.length; i++) {
    var posts = await asyncFetchTagPosts(
      query, tags[i]._id, likedPostIds, 
      Post, User, mongoose,
      handleFilterTagRegex,
      handleFilterPostContentRegex
    )
    tagPosts = [...tagPosts, ...posts]
  }
  return tagPosts
}

const asyncFetchTagPosts = async (
  query, 
  tagId, 
  likedPostIds,
  Post, 
  User, 
  mongoose,
  handleFilterTagRegex,
  handleFilterPostContentRegex
) => {
  var recastTagId = mongoose.Types.ObjectId(tagId)

  var user = await User.findOne({ blogName: query })
  
  var filteredTagRegex = handleFilterTagRegex(user)

  var filteredPostContentRegex = handleFilterPostContentRegex(user)
  
  var posts = await Post.aggregate([
    {
      $lookup: {
        from: 'posts',
        let: {
          likedPostIds: likedPostIds,
          tagId: recastTagId,
          filteredTagRegex: filteredTagRegex,
          filteredPostContentRegex: filteredPostContentRegex
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $not: { $in: ["$_id", "$$likedPostIds"] } },
                  { $not: [
                      {
                        $regexMatch: {
                          input: "$tagTitles",
                          regex: "$$filteredTagRegex"
                        }
                      }
                    ]
                  },
                  { $not: [
                      {
                        $regexMatch: {
                          input: "$allText",
                          regex: "$$filteredPostContentRegex"
                        }
                      }
                    ]
                  },
                  // { $or: [
                  //     { $in: [ "$$tagId", "$tagIds" ] },
                  //   ]
                  // }
                ]
              }
            }
          }
        ],
        as: 'posts'
      }
    },
    { $unwind: '$posts' },
    { $replaceRoot: { "newRoot": "$posts" } },
    { $sort: { "notesHeatLastTwoDays": -1 } },
    { $limit: 50 }
  ])
  return posts
}

const RootQueryTypeUtil = {
  handleFilterTagRegex,
  handleFilterPostContentRegex,
  asyncFetchTagPosts,
  asyncTagPostArr
}

export default RootQueryTypeUtil;