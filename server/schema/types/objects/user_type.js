import graphql from 'graphql';
import mongoose from 'mongoose';
import AnyPostType from '../unions/any_post_type.js'
import TagType from '../objects/posts/util/tag_type.js'
import LikeType from '../objects/posts/util/like_type.js'
import RepostType from '../objects/posts/util/repost_type.js'
import FollowType from '../objects/posts/util/follow_type.js'
import ImageType from './posts/util/image_type.js';
const User = mongoose.model('User');
const { GraphQLObjectType, GraphQLString,
        GraphQLList, GraphQLInt,
        GraphQLBoolean, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: { type: GraphQLID },
    blogName: { type: GraphQLString },
    blogDescription: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    followerCount: { type: GraphQLInt },
    postingHeatLastMonth: { type: GraphQLInt },
    loggedIn: { type: GraphQLBoolean },
    ////Uncomment for email auth
    // authenticated: { type: GraphQLBoolean },
    // emailAuthToken: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    lastUpdated: { type: GraphQLInt },
    kind: { type: GraphQLString },
    profilePic: {
      type: ImageType,
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('profilePic')
          .then(user => user.profilePic)
      }
    },
    reposts: {
      type: new GraphQLList(RepostType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('reposts')
          .then(user => user.reposts)
      }
    },
    tagFollows: {
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('tagFollows')
          .then(user => user.tagFollows)
      }
    },
    userFollows: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('userFollows')
          .then(user => user.userFollows)
      }
    },
    userFollowing: { 
      type: GraphQLList(UserType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('userFollowing')
        .then(user => user.userFollowing)
      }
    },
    filteredTags: {
      type: GraphQLList(GraphQLString)
    },
    filteredPostContent: {
      type: GraphQLList(GraphQLString)
    },
    likes: { 
      type: GraphQLList(LikeType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('likes')
        .then(user => user.likes)
      }
    },
    likedPosts: { 
      type: GraphQLList(AnyPostType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
        .populate('likedPosts')
        .then(user => user.likedPosts)
      }
    },
    followers: { 
      type: GraphQLList(FollowType),
      resolve(parentValue) {
        
        return User.aggregate([
          { $match: { _id: parentValue._id } },
          { $lookup: {
              from: 'follows',
              localField: '_id',
              foreignField: 'follows',
              as: 'followers'
            }
          },
          { $unwind: "$followers" },
          { $replaceRoot: { "newRoot": "$followers" } }
        ]).then(res => {
          return res
        })
      }
    },
    followersCount: { 
      type: GraphQLInt,
      resolve(parentValue) {
        
        return User.aggregate([
          { $match: { _id: parentValue._id } },
          { $lookup: {
              from: 'follows',
              localField: '_id',
              foreignField: 'follows',
              as: 'followers'
            }
          },
          {
            $project: {
              followersCount: { $size: "$followers"}
            }
          }
        ]).then(res => {
          return res[0].followersCount
        })
      }
    },
    userPostsCount: { 
      type: GraphQLInt,
      resolve(parentValue) {
        
        return User.aggregate([
          { $match: { _id: parentValue._id } },
          { $lookup: {
              from: 'posts',
              localField: '_id',
              foreignField: 'user',
              as: 'posts'
            }
          },
          {
            $project: {
              userPostCount: { $size: "$posts"}
            }
          }
        ]).then(res => {
          return res[0].userPostsCount
        })
      }
    },
    userFollowCount: {
      type: GraphQLInt,
      resolve(parentValue) {
        return User.aggregate([
          { $match: { _id: parentValue._id } },
          {
            $lookup: {
              from: 'follows',
              let: { user: parentValue._id, onModel: 'User' },
                pipeline: [
                  { $match: {
                    $expr: {
                      $and: 
                      [
                        { $eq: [ "$user", "$$user" ] },
                        { $eq: [ "$onModel", "$$onModel" ]}
                      ]
                    }
                  }
                }
              ],
              as: 'followedUsers'
            }
          },
          {
            $project: {
              "followedUsersCount": { "$size": "$followedUsers" }
            }
          }
        ]).then(res => res[0].followedUsersCount)
      }
    },
    totalLikeCount: {
      type: GraphQLInt,
      resolve(parentValue) {
        return User.aggregate([
          { $match: { _id: parentValue._id } },
          { 
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'user',
              as: 'likes'
            }
          },
          { 
            $project: {
              "totalLikeCount": { "$size": '$likes' }
            }
          }
        ]).then(res => res[0].totalLikeCount)
      }
    },
  })
})

export default UserType;