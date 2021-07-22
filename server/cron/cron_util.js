import mongoose from 'mongoose';
import cron from 'node-cron';
const Tag = mongoose.model('Tag');
const Follow = mongoose.model('Follow');
const Mention = mongoose.model('Mention');
const Like = mongoose.model('Like');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');


var cronTagFollowerHeat = cron.schedule('* 23 * * *', async () => {
  var allTags =  await Tag.find()
  var aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
  
  for (var i = 0; i < allTags.length; i++) {
    var tag = allTags[i]
    
    var countLastWeek =  await Follow.aggregate([
      {
        $lookup: {
          from: 'follows',
          let: {
            aWeekAgo: aWeekAgo,
            tagId: mongoose.Types.ObjectId(tag._id)
          },
          pipeline: [
            { $match: {
              $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$aWeekAgo"] },
                    { $eq: ["$follows", "$$tagId"] }
                  ]
                }
              }
            }
          ],
          as: 'follows'
        }
      },
      {
        $project: {
          followerCountLastWeek: { $size: "$follows" }
        }
      }
    ]).then(res => {
      return res[0].followerCountLastWeek
    })
    
    tag.followerHeatLastWeek = countLastWeek
    await tag.save()
  }
})

var cronTagPostHeat = cron.schedule('* 23 * * *', async () => {
  var allTags =  await Tag.find()
  var aWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))

  for (var i = 0; i < allTags.length; i++) {
    var tag = allTags[i]
    
    var countLastWeek =  await Tag.aggregate([
      {
        $lookup: {
          from: 'posts',
          let: { 
            aWeekAgo: aWeekAgo,
            tagId: mongoose.Types.ObjectId(tag._id)
          },
          pipeline: [
            { $match: {
              $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$aWeekAgo"] },
                    { $in: ["$$tagId", "$tagIds"] }
                  ]
                }
              }
            }
          ],
          as: 'posts'
        }
      },
      {
        $project: {
          postCountLastWeek: { $size: "$posts" }
        }
      }
    ]).then(res => {
      return res[0].postCountLastWeek
    })
    
    tag.postHeatLastWeek = countLastWeek
    await tag.save()
  }
})

var cronUserPostingHeat = cron.schedule('* * * * 0', async () => {
  var thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
  var allUsers = await User.find({})
  

  for (var i = 0; i < allUsers.length; i++) {
    var user = allUsers[i]
    
    var countLastThirtyDays =  await Post.aggregate([
      {
        $lookup: {
          from: 'posts',
          let: { 
            thirtyDaysAgo: thirtyDaysAgo,
            userId: mongoose.Types.ObjectId(user._id)
          },
          pipeline: [
            { $match: {
              $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$thirtyDaysAgo"] },
                    { $eq: ["$user", "$$userId"] }
                  ]
                }
              }
            }
          ],
          as: 'posts'
        }
      },
      {
        $project: {
          postCountLastThirtyDays: { $size: "$posts" }
        }
      },
      {
        $group: {
          _id: '$postCountLastThirtyDays'
        }
      }
    ]).then(res => {
      return res[0]._id
    })
    
    user.postingHeatLastMonth = countLastThirtyDays
    await user.save()
  }
})

var cronPostNotesHeat = cron.schedule('* 1 * * *', async () => {
  var twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2))
  var sixtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 60))
  var postsPast2Months = await Post.find({ createdAt: { $gt: sixtyDaysAgo } })
  
  for (var i2 = 0; i2 < postsPast2Months.length; i2++) {
    var post = postsPast2Months[i2]
  
    var mentionsLastTwelveHours = await Mention.aggregate([
      { 
        $lookup: {
          from: 'mentions',
          let: {
            twoDaysAgo: twoDaysAgo,
            postId: mongoose.Types.ObjectId(post._id)
          },
          pipeline: [
            { $match: {
                $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$twoDaysAgo"] },
                    { $eq: ["$post", "$$postId"] }
                  ]
                }
              }
            }
          ],
          as: 'mentions'
        }
      },
      {
        $project: {
          mentionsLastTwelveHours: { $size: "$mentions" }
        }
      }
    ]).then(res => {
      return res[0].mentionsLastTwelveHours
    })

    var repostsLastTwelveHours = await Post.aggregate([
      { 
        $lookup: {
          from: 'posts',
          let: {
            twoDaysAgo: twoDaysAgo,
            postId: mongoose.Types.ObjectId(post._id),
            kind: 'Repost'
          },
          pipeline: [
            { $match: {
                $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$twoDaysAgo"] },
                    { $eq: ["$post", "$$postId"] },
                    { $eq: ["$kind", "$$kind"] },
                  ]
                }
              }
            }
          ],
          as: 'reposts'
        }
      },
      {
        $project: {
          repostsLastTwelveHours: { $size: "$reposts" }
        }
      }
    ]).then(res => {
      return res[0].repostsLastTwelveHours
    })

    var commentsLastTwelveHours = await Comment.aggregate([
      { 
        $lookup: {
          from: 'comments',
          let: {
            twoDaysAgo: twoDaysAgo,
            postId: mongoose.Types.ObjectId(post._id)
          },
          pipeline: [
            { $match: {
                $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$twoDaysAgo"] },
                    { $eq: ["$post", "$$postId"] }
                  ]
                }
              }
            }
          ],
          as: 'comments'
        }
      },
      {
        $project: {
          commentsLastTwelveHours: { $size: "$comments" }
        }
      }
    ]).then(res => {
      return res[0].commentsLastTwelveHours
    })

    var likesLastTwelveHours = await Like.aggregate([
      { 
        $lookup: {
          from: 'likes',
          let: {
            twoDaysAgo: twoDaysAgo,
            postId: mongoose.Types.ObjectId(post._id)
          },
          pipeline: [
            { $match: {
                $expr: {
                  $and:
                  [
                    { $gt: ["$createdAt", "$$twoDaysAgo"] },
                    { $eq: ["$post", "$$postId"] }
                  ]
                }
              }
            }
          ],
          as: 'likes'
        }
      },
      {
        $project: {
          likesLastTwelveHours: { $size: "$likes" }
        }
      }
    ]).then(res => {
      return res[0].likesLastTwelveHours
    })

    post.notesHeatLastTwoDays =
    mentionsLastTwelveHours +
    repostsLastTwelveHours +
    commentsLastTwelveHours +
    likesLastTwelveHours

    await post.save()
  }
})

const CronUtil = {
  cronTagFollowerHeat,
  cronTagPostHeat,
  cronPostNotesHeat,
  cronUserPostingHeat
}

export default CronUtil