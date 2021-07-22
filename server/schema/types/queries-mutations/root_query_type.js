import mongoose from 'mongoose';
import graphql from 'graphql';
import jwt from 'jsonwebtoken';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
import ImageType from '../objects/posts/util/image_type.js';
import TagType from '../objects/posts/util/tag_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import UserAndTagInputType from '../inputs/user_and_tag_input_type.js'
import AnyPostType from '../unions/any_post_type.js'
import AnyActivityType from '../unions/any_activity_type.js'
import LikeRepostAndCommentType from '../unions/like_repost_and_comment_type.js'
import LikeType from '../objects/posts/util/like_type.js'
import SearchUtil from '../../../services/search_util.js';
import RootQueryTypeUtil from './util/root_query_type_util.js';
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Image = mongoose.model('Image');
const Tag = mongoose.model('Tag');
const Like = mongoose.model('Like');
const Follow = mongoose.model('Follow');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLInt } = graphql;
const { handleFilterTagRegex, 
        handleFilterPostContentRegex,
        asyncTagPostArr,
        asyncFetchTagPosts } = RootQueryTypeUtil;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    usersAndTags: {
      type: new GraphQLList(UserAndTagType),
      args: { filter: { type: UserAndTagInputType } },
      async resolve(_, { filter }, ctx) {
        if (filter) {
          let query = filter ? {$or: SearchUtil.buildFilters(filter)} : '';
  
          if (query.$or.length === 0) {
            return []
          }
          
          const users = async (query) => {
            return await User.find(query.$or[0]).limit(10).exec();
          }
  
          const tags = async (query) => {
            return await Tag.find(query.$or[1]).limit(10).exec();
          }
          
          const decoded = jwt.verify(ctx.headers.authorization, keys.secretOrKey)
          const { _id } = decoded;
  
          return Promise.all([
            users(query), 
            tags(query), 
            User.findById(_id)
          ]).then(
              ([users, tags, user]) => {
                
                var filteredTags = tags.filter(tag =>
                  !user.tagFollows.includes(tag._id)
                )
                
                return [...users, ...filteredTags]
              }
            )
        } else {
          return []
        }
      }
    },
    fetchMatchingTags: {
      type: new GraphQLList(TagType),
      args: { filter: { type: GraphQLString } },
      resolve(_, {filter}) {
        if (filter === '') {
          return [];
        }
        let query = {};
        query.title = new RegExp(filter);
        
        const tags = async (query) => {
          return await Tag.find(query).limit(5).exec()
        }

        return Promise.all([tags(query)]).then(([tags]) => {
          return [...tags]
        })
      }
    },
    fetchUserLikes: {
      type: GraphQLList(LikeType),
      args: {
        query: { type: GraphQLString }
      },
      resolve(_, { query }) {
        return User
          .aggregate([
            { $match: { blogName: query } },
            {
              $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'user',
                as: 'likes'
              }
            },
            { $unwind: '$likes' },
            { $replaceRoot: { "newRoot": '$likes' } }
          ]).then(res => res)
      }
    },
    doesUserLikePost: {
      type: LikeType,
      args: {
        user: { type: GraphQLString },
        postId: { type: GraphQLID }
      },
      resolve(_, {user, postId}) {
        var recastPostId = mongoose.Types.ObjectId(postId)

        return User.aggregate([
          { $match: { blogName: user } },
          {
            $lookup: {
              from: 'likes',
              let: { userId: "$_id", postId: recastPostId },
              pipeline: [
                { $match: {
                    $expr: {
                      $and: 
                        [
                          { $eq: [ "$user", "$$userId" ] },
                          { $eq: [ "$post", "$$postId" ] }
                        ]
                    }
                  }
                },
              ],
              as: "like"
            }
          },
          { $unwind: "$like" },
          { $replaceRoot: { "newRoot": "$like" } }
        ]).then(res => res[0])
      }
    },
    doesUserFollowUser: {
      type: FollowType,
      args: {
        user: { type: GraphQLString },
        otherUser: { type: GraphQLString }
      },
      resolve(_, {user, otherUser}) {
        return Promise.all(([
          User.find({
            blogName: {
              $in: [user, otherUser]
            }
          })
        ])).then(users => {
            const foundUser = user === users[0][0].blogName ? users[0][0] : users[0][1];
            const foundOtherUser = otherUser === users[0][0].blogName ? users[0][0] : users[0][1];
          
            return Promise.all(([
              Follow
              .aggregate([
                {
                  $lookup: {
                    from: 'follows',
                    let: { user: foundUser._id, otherUser: foundOtherUser._id },
                    pipeline: [
                        { $match: {
                          $expr: {
                            $and: 
                            [
                              { $eq: [ "$user", "$$user" ] },
                              { $eq: [ "$follows", "$$otherUser" ] }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'follow'
                  }
                },
                { $unwind: "$follow" },
                { $replaceRoot: { "newRoot": "$follow" } }
              ])
            ])).then(res => res[0][0])
          })
      }
    },
    doesUserFollowTag: {
      type: FollowType,
      args: {
        query: { type: GraphQLString },
        tagId: { type: GraphQLID }
      },
      resolve(_, { query, tagId }) {
        var recastTagId = mongoose.Types.ObjectId(tagId)
        
        return User.aggregate([
          { $match: { blogName: query } },
          { $lookup: {
              from: 'follows',
              let: { userId: '$_id', tagId: recastTagId },
              pipeline: [
                { $match: {
                    $expr: {
                      $and:
                      [
                        { $eq: [ "$user", "$$userId" ] },
                        { $eq: [ "$follows", "$$tagId" ] }
                      ]
                    }
                  }
                }
              ],
              as: "followed"
            }
          },
          { $unwind: "$followed" },
          { $replaceRoot: { "newRoot": "$followed" } }
        ]).then(res => {
          return res[0]
        })
      }
    },
    fetchUserFeed: {
      type: new GraphQLList(AnyPostType),
      args: { 
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(_, { query, cursorId }) {
        return User.findOne({ blogName: query })
          .populate('tagFollows')
          .then(user => {
            return Follow.find({ user: user, onModel: 'User' })
              .then(follows => {
                
                var filteredTagRegex = handleFilterTagRegex(user)
                
                var filteredPostContentRegex = handleFilterPostContentRegex(user)
           
                var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))

                var recastPostId;
                recastPostId = mongoose.Types.ObjectId(cursorId)
                
                return Post.aggregate([
                  { 
                    $lookup: {
                      from: 'posts',
                      let: { 
                        userId: user._id,
                        follows: followIds,
                        cursor: recastPostId,
                        filteredTagRegex: filteredTagRegex,
                        filteredPostContentRegex: filteredPostContentRegex
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $and: [
                                { $lt: [ "$_id", "$$cursor" ] },
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
                                  { $or: [
                                    { $eq: [ "$user", "$$userId" ] },
                                    { $in: [ "$user", "$$follows" ] },
                                  ]
                                }
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
                  { $sort: { "createdAt": -1 } },
                  { $limit: 50 }
                ]).then(res => {
                  return res
                })
              })
          })
      }
    },
    fetchTagFeed: {
      type: new GraphQLList(AnyPostType),
      args: { 
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(_, { query }) {
        var hashedQuery = '#' + query

        return Tag.aggregate([
          { $match: { title: hashedQuery } },
              { $lookup: {
                  from: 'posts',
                  localField: '_id',
                  foreignField: 'tagIds',
                  as: 'postsWithTag'
                }
              },
              { $unwind: "$postsWithTag" },
              { $replaceRoot: { "newRoot": "$postsWithTag" } },
              { $sort: { "createdAt": -1 } }
        ]).then(res => res)
      }
    },
    fetchLikesRepostsAndComments: {
      type: new GraphQLList(LikeRepostAndCommentType),
      args: { postId: { type: GraphQLID } },
      resolve(parentValue, { postId }) {
        var recastPostId = mongoose.Types.ObjectId(postId)
        return Post.aggregate([
          { $match: { _id: recastPostId } },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'post',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'post',
              as: 'comments'
            }
          },
          {
            $lookup: {  
              from: 'posts',
              let: { postId: '$_id', postKind: 'Repost' },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$post", "$$postId" ] },
                        { $eq: [ "$kind", "$$postKind" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'reposts'
            }
          },
          { $addFields: { 
              notes: { 
                $concatArrays: [ 
                  "$likes", "$reposts", "$comments"
                ] 
              } 
            } 
          },
          { $unwind: "$notes" },
          { $replaceRoot: { "newRoot": "$notes" } },
          { $sort: { "createdAt": 1 } },
          { $limit: 25 }
        ]).then(res => res)
      }
    },
    fetchUsersForMentions: {
      type: GraphQLList(UserType),
      args: { filter: { type: GraphQLString } },
      resolve(parentValue, { filter }) {
        if (filter === '') {
          return [];
        }
        let query = {};
        query.blogName = new RegExp(filter);
        
        const users = async (query) => {
          return await User.find(query).limit(7).exec()
        }

        return Promise.all([users(query)]).then(([users]) => {
          return [...users]
        }) 
      }
    },
    fetchAllUserActivity: {
      type: GraphQLList(AnyActivityType),
      args: { 
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(parentValue, { query, cursorId }) {
        var recastPostId = mongoose.Types.ObjectId(cursorId)
        
        return User.aggregate([
          { $match: { blogName: query } },
          {
            $lookup: {  
              from: 'mentions',
              let: { userId: '$_id', cursor: recastPostId },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $lt: [ "$_id", "$$cursor" ] },
                        { $eq: [ "$mention", "$$userId" ] },
                      ]
                    }
                  }
                }
              ],
              as: 'mentions'
            }
          },
          {
            $lookup: {  
              from: 'posts',
              let: { userId: '$_id', cursor: recastPostId, kind: 'Repost' },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $lt: [ "$_id", "$$cursor" ] },
                        { $eq: [ "$repostedFrom", "$$userId" ] },
                        { $eq: [ "$kind", "$$kind" ] },
                      ]
                    }
                  }
                }
              ],
              as: 'reposts'
            }
          },
          {
            $lookup: {  
              from: 'comments',
              let: { userId: '$_id', cursor: recastPostId },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$postAuthorId", "$$userId" ] },
                        { $lt: [ "$_id", "$$cursor" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'comments'
            }
          },
          {
            $lookup: {  
              from: 'follows',
              let: { userId: '$_id', cursor: recastPostId },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$follows", "$$userId" ] },
                        { $lt: [ "$_id", "$$cursor" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'follows'
            }
          },
          {
            $lookup: {
              from: 'likes',
              let: { userId: '$_id', cursor: recastPostId },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$postAuthor", "$$userId" ] },
                        { $lt: [ "$_id", "$$cursor" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'likes'
            }
          },
          { $addFields: { 
              allActivity: { 
                $concatArrays: [ 
                  "$mentions", "$reposts", "$comments", "$follows", "$likes"
                ] 
              } 
            } 
          },
          { $unwind: "$allActivity" },
          { $replaceRoot: { "newRoot": "$allActivity" } },
          { $sort: { "createdAt": -1 } },
          { $limit: 25 }
        ]).then(res => {
          return res
        })
      }
    },
    fetchActivityCount: {
      type: GraphQLInt,
      args: { 
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(parentValue, { query, cursorId }) {
        var dateNum = parseInt(cursorId)
        
        return User.aggregate([
          { $match: { blogName: query } },
          {
            $lookup: {  
              from: 'mentions',
              let: { userId: '$_id', cursorId: new Date(dateNum) },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and:
                      [
                        { $gt: [ "$createdAt", "$$cursorId"]},
                        { $eq: [ "$mention", "$$userId" ] },
                      ]
                    }
                  }
                }
              ],
              as: 'mentions'
            }
          },
          {
            $lookup: {  
              from: 'posts',
              let: { userId: '$_id', kind: 'Repost', cursorId: new Date(dateNum) },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and:
                      [
                        { $gt: [ "$createdAt", "$$cursorId"]},
                        { $eq: [ "$kind", "$$kind" ] },
                        { $eq: [ "$postAuthor", "$$userId" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'reposts'
            }
          },
          {
            $lookup: {  
              from: 'comments',
              let: { userId: '$_id', cursorId: new Date(dateNum) },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and:
                      [
                        { $gt: [ "$createdAt", "$$cursorId"]},
                        { $eq: [ "$user", "$$postAuthorId" ] },
                      ]
                    }
                  }
                }
              ],
              as: 'comments'
            }
          },
          {
            $lookup: {  
              from: 'likes',
              let: { userId: '$_id', cursorId: new Date(dateNum) },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and:
                      [
                        { $gt: [ "$createdAt", "$$cursorId"]},
                        { $eq: [ "$user", "$$postAuthor" ] },
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
              mentionsCount: { $size: "$mentions" },
              repostsCount: { $size: "$reposts" },
              commentsCount: { $size: "$comments" },
              likesCount: { $size: "$likes" },
            }
          }
        ]).then(res => {
          return res[0].mentionsCount + 
          res[0].repostsCount + 
          res[0].commentsCount + 
          res[0].likesCount
        })
      }
    },
    fetchUserFollowers: {
      type: GraphQLList(FollowType),
      args: {
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(parentValue, { query, cursorId }) {
        var recastPostId = mongoose.Types.ObjectId(cursorId)
        return User.aggregate([
          { $match: { blogName: query } },
          { $lookup: {
            from: 'follows',
            let: { 
              userId: '$_id', 
              cursorId: recastPostId, 
              onModel: 'User'
            },
              pipeline: [
                { $match: {
                    $expr: {
                      $and:
                      [
                        { $lt: [ "$_id", "$$cursorId"]},
                        { $eq: [ "$follows", "$$userId" ] },
                        { $eq: [ "$onModel", "$$onModel" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'followers'
            }
          },
          { $unwind: "$followers" },
          { $replaceRoot: { "newRoot": "$followers" } },
          { $sort: { "createdAt": -1 } },
          { $limit: 100 }
        ]).then(res => {
          return res
        })
      }
    },
    fetchUserBlogFeed: {
      type: GraphQLList(AnyPostType),
      args: {
        query: { type: GraphQLString }
      },
      resolve(parentValue, { query }) {
        return User.aggregate([
          { $match: { blogName: query } },
          { $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: 'user',
              as: 'posts'
            }
          },
          { $unwind: '$posts' },
          { $replaceRoot: { "newRoot": "$posts" } },
          { $sort: { "createdAt": -1 } } 
        ]).then(res => {
          return res          
        })
      }
    },
    fetchFollowedUsers: {
      type: GraphQLList(FollowType),
      args: {
        query: { type: GraphQLString },
        cursorId: { type: GraphQLString }
      },
      resolve(parentValue, { query, cursorId }) {
        var recastPostId = mongoose.Types.ObjectId(cursorId)
        return User.aggregate([
          { $match: { blogName: query } },
          { $lookup: {
            from: 'follows',
            let: { 
              userId: '$_id', 
              cursorId: recastPostId, 
              onModel: 'User' 
            },
              pipeline: [
                { $match: {
                    $expr: {
                      $and:
                      [
                        { $lt: [ "$_id", "$$cursorId"]},
                        { $eq: [ "$user", "$$userId" ] },
                        { $eq: [ "$onModel", "$$onModel" ] }
                      ]
                    }
                  }
                }
              ],
              as: 'followed'
            }
          },
          { $unwind: "$followed" },
          { $replaceRoot: { "newRoot": "$followed" } },
          { $sort: { "createdAt": -1 } },
          { $limit: 100 }
        ]).then(res => {
          return res
        })
      }
    },
    fetchRecommendedTags: {
      type: GraphQLList(TagType),
      args: {
        query: { type: GraphQLString }
      },
      resolve(parentValue, { query }) {
        return User.findOne({ blogName: query })
          .then(user => {
            return Tag.find({
              '_id': { $nin: user.tagFollows },
              function(err) {
                console.log(err)
              }
            })
              .sort('followerCount')
              .limit(8)
          })
      }
    },
    fetchDiscoverFeed: {
      type: GraphQLList(AnyPostType),
      args: { query: { type: GraphQLString } },
      resolve(parentValue, { query }) {
        return User
        .aggregate([
          { $match: { blogName: query } },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'user',
              as: 'likes'
            }
          },
          { $unwind: '$likes' },
          { $replaceRoot: { "newRoot": '$likes' } }
        ]).then(likes => {
          var likedPostIds = likes.map(l => l.post._id)

          return User.findOne({ blogName: query })
            .then(user => {
              var filteredTagRegex = handleFilterTagRegex(user)
    
              var filteredPostContentRegex = handleFilterPostContentRegex(user)
    
              return Post.aggregate([
                {
                  $lookup: {
                    from: 'posts',
                    let: {
                      userId: user._id,
                      likedPostIds: likedPostIds,
                      filteredTagRegex: filteredTagRegex,
                      filteredPostContentRegex: filteredPostContentRegex
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and:
                            [
                              { $not: { $eq: ["$user", "$$userId" ] } },
                              { $not: { $in: ["$_id", "$$likedPostIds" ] } },
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
                              }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'posts'
                  }
                },
                { $group: {
                    _id: '$posts'
                  }
                },
                { $unwind: '$_id' },
                { $replaceRoot: { "newRoot": "$_id" } },
                { $sort: { "notesHeatLastTwoDays": 1, "notesCount": 1 } },
                { $limit: 30 }
              ]).then(posts => {
                return posts
              })
            })
        })
      }
    },
    fetchPostRadar: {
      type: AnyPostType,
      args: {
        query: { type: GraphQLString }
      },
      resolve(parentValue, { query }) {
        return User.findOne({ blogName: query })
          .then(user => {
            var filteredTagRegex = handleFilterTagRegex(user)

            var filteredPostContentRegex = handleFilterPostContentRegex(user)

            return User.aggregate([
              {
                $lookup: {
                  from: 'follows',
                  let: {
                    userId: mongoose.Types.ObjectId(user._id),
                    onModel: 'User',
                  },
                  pipeline: [
                    { $match: {
                        $expr: {
                          $and:
                          [
                            { $eq: ["$user", "$$userId"] },
                            { $eq: ["$onModel", "$$onModel"] },
                          ]
                        }
                      }
                    }
                  ],
                  as: 'follows'
                }
              },
              { $unwind: "$follows" },
              { $replaceRoot: { "newRoot": "$follows" } },
              {
                $project: {
                  follows: 1
                }
              }
            ]).then(follows => {
              var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))

              return Post.aggregate([
                {
                  $lookup: {
                    from: 'posts',
                    let: {
                      userId: mongoose.Types.ObjectId(user._id),
                      followIds: followIds,
                      filteredTagRegex: filteredTagRegex,
                      filteredPostContentRegex: filteredPostContentRegex
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and:
                            [
                              { $not: { $eq: ["$user", "$$userId" ] } },
                              { $not: { $in: ["$user", "$$followIds" ] } },
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
                              }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'posts'
                  }
                },
                { $group: {
                    _id: '$posts'
                  }
                },
                { $unwind: '$_id' },
                { $replaceRoot: { "newRoot": "$_id" } },
                { $sort: { "notesHeatLastTwoDays": 1, "notesCount": 1 } },
                { $limit: 10 }
              ]).then(posts => {
                var post = posts[Math.floor(Math.random() * posts.length)]
                return post
              })
            })
          })
      }
    },
    fetchCheckOutTheseBlogs: {
      type: GraphQLList(UserType),
      args: {
        query: { type: GraphQLString }
      },
      resolve(parentValue, { query }) {
        
        return User.aggregate([
          { $match: { blogName: query } },
          {
            $lookup: {
              from: 'follows',
              let: {
                userId: '$_id',
                onModel: 'User',
              },
              pipeline: [
                { $match: {
                    $expr: {
                      $and:
                      [
                        { $eq: ["$user", "$$userId"] },
                        { $eq: ["$onModel", "$$onModel"] },
                      ]
                    }
                  }
                }
              ],
              as: 'follows'
            }
          },
          { $unwind: "$follows" },
          { $replaceRoot: { "newRoot": "$follows" } },
          {
            $project: {
              follows: 1
            }
          }
        ]).then(follows => {
          var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))
          
          return User.find({
            '_id': { $nin: followIds },
            'blogName': { $ne: query }
          })
          .sort([
            ['postingHeatLastMonth', -1], 
            ['followerCount', -1]
          ])
          .limit(4)
          .then(users => {
            return users
          })
        })

      }
    },
    user: {
      type: UserType,
      args: { query: { type: GraphQLString } },
      resolve(parentValue, { query }) {
        return User.findOne({ blogName: query })
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    post: {
      type: AnyPostType,
      args: {
        query: { type: GraphQLID }
      },
      resolve(parentValue, { query }) {
        return Post.findById(query)
      }
    },
    image: {
      type: ImageType,
      args: { _id: { type: GraphQLID } },
      resolve(parentValue, args) {
        return Image.findById(args._id)
      }
    },
    images: {
      type: new GraphQLList(ImageType),
      resolve() {
        return Image.find({})
      }
    },
    tags: {
      type: new GraphQLList(TagType),
      resolve() {
        return Tag.find({})
      }
    },
    tag: {
      type: TagType,
      args: { query: { type: GraphQLString } },
      resolve(_, { query }) {
        return Tag.findOne({ title: query })
      }
    },
    like: {
      type: LikeType,
      args: { _id: { type: GraphQLID } },
      resolve(_, {_id}) {
        return Like.findById(_id)
      }
    },
  })
})

export default RootQueryType;