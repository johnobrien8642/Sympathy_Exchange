import mongoose from 'mongoose';
import graphql from 'graphql';
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import aws from 'aws-sdk';

import keys from '../../../config/keys.js'
import UserType from '../objects/user_type.js';
import AuthService from '../../../services/auth_util.js';
import RepostType from '../objects/posts/util/repost_type.js';
import LikeType from '../objects/posts/util/like_type.js';
import FollowType from '../objects/posts/util/follow_type.js';
import CommentType from '../objects/posts/util/comment_type.js';
import AnyPostType from '../unions/any_post_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import RepostCaptionType from '../objects/posts/util/repost_caption_type.js'
import RepostOrRepostCaptionType from '../unions/repost_or_repost_caption_type.js';
import createOrUpdatePost from '../../../models/posts/types/util/create_or_update_function.js';
import DeleteFunctionUtil from '../../../models/posts/types/util/delete_function_util.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const { deletePost, 
        asyncDeleteAllPosts, 
        asyncDeleteAllActivityAndProfilePic,
        handleS3Cleanup, handles3AndObjectCleanup } = DeleteFunctionUtil;

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Repost = mongoose.model('Repost');
const Like = mongoose.model('Like');
const Comment = mongoose.model('Comment')
const Follow = mongoose.model('Follow');
const Image = mongoose.model('Image');
const RepostCaption = mongoose.model('RepostCaption');
const { GraphQLObjectType, GraphQLID,
        GraphQLString, GraphQLList, GraphQLInt } = graphql;

var s3Client = new aws.S3({
  secretAccessKey: keys.secretAccessKey,
  accessKeyId: keys.accessKeyId,
  region: 'us-east-1'
})

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    registerUser: {
      type: UserType,
      args: {
        instanceData: { type: GraphQLJSONObject }
      },
      resolve(_, { instanceData }, ctx) {
        return AuthService.register(instanceData, ctx).then(res => {
          ctx.headers.authorization = JSON.stringify(res.token)
          return res
        })
      }
    },
    logoutUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, { token }) {
        return AuthService.logout(token)
      }
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args)
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verify(args)
      }
    },
    createOrUpdatePost: {
      type: AnyPostType,
      args: {
        instanceData: { type: GraphQLJSONObject },
      },
      resolve(_, { instanceData }) {
        return createOrUpdatePost(instanceData)
      }
    },
    deletePost: {
      type: GraphQLID,
      args: {
        post: { type: GraphQLJSONObject }
      },
      resolve(_, { post }) {
        return deletePost(
          post,
          s3Client,
          keys,
          handles3AndObjectCleanup
        )
      }
    },
    likePost: {
      type: LikeType,
      args: {
        postId: { type: GraphQLID },
        user: { type: GraphQLString },
        postKind: { type: GraphQLString }
      },
      resolve(_, { postId, user, postKind }) {
        var like = new Like();
        
        return Promise.all([
          User.findOne({ blogName: user }),
          Post.findById(postId)
        ]).then(([user, foundPost]) => {
          like.user = user._id
          like.post = postId
          like.postAuthor = foundPost.user._id
          like.onModel = postKind

          foundPost.notesCount = foundPost.notesCount + 1
          return Promise.all(([like.save(), foundPost.save()]))
            .then(([like, post]) => (like))
        })
      }
    },
    unlikePost: {
      type: LikeType,
      args: {
        likeId: { type: GraphQLID },
        postId: { type: GraphQLID }
      },
      resolve(_, { likeId, postId }) {
        
        return Promise.all([
          Post.findById(postId),
          Like.deleteOne({ _id: likeId })
        ]).then(([foundPost, like]) => {
          foundPost.notesCount = foundPost.notesCount - 1

          return foundPost.save().then(post => post)
        })
      }
    },
    follow: {
      type: UserAndTagType,
      args: {
        user: { type: GraphQLString },
        item: { type: GraphQLString },
        itemKind: { type: GraphQLString }
      },
      resolve(_, { user, item, itemKind }) {
        var follow = new Follow({
          onModel: itemKind
        })
        var recastItem = mongoose.Types.ObjectId(item)

        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ _id: recastItem }),
          Tag.findOne({ _id: recastItem }),
        ]).then(([user, followsUser, tag ]) => {
          follow.user = user._id
          
          if (followsUser) {
            follow.follows = followsUser._id
            followsUser.followerCount = followsUser.followerCount + 1
            user.userFollows.push(followsUser._id)

            return Promise.all([
              follow.save(),
              followsUser.save(),
              user.save()
            ]).then(([follow, followsUser, user]) => followsUser)
          } else if (tag) {
            follow.follows = tag._id
            tag.followerCount = tag.followerCount + 1
            user.tagFollows.push(tag._id)

            return Promise.all([
              follow.save(),
              user.save(),
              tag.save()
            ]).then(([follow, user, tag]) => tag)
          }
        })
      }
    },
    unfollow: {
      type: UserAndTagType,
      args: {
        user: { type: GraphQLString },
        item: { type: GraphQLID }
      },
      resolve(_, { user, item }) {
        var recastItem = mongoose.Types.ObjectId(item)

        return Promise.all([
          User.findOne({ blogName: user }),
          User.findOne({ _id: recastItem }),
          Tag.findOne({ _id: recastItem }),
        ]).then(([user, followsUser, tag]) => {

          if (followsUser) {
            user.userFollows = user.userFollows.filter(obj => obj._id.toString() !== followsUser._id.toString())
            followsUser.followerCount = followsUser.followerCount - 1
            
            return Promise.all([
              user.save(),
              followsUser.save(),
              Follow.deleteOne({ user: mongoose.Types.ObjectId(user._id), follows: mongoose.Types.ObjectId(followsUser._id) })
            ]).then(([user, followsUser, follow]) => followsUser)
          } else if (tag) {
            user.userFollows = user.userFollows.filter(obj => obj._id.toString() !== tag._id.toString())
            tag.followerCount = tag.followerCount - 1
      
            return Promise.all([
              tag.save(),
              user.save(),
              Follow.deleteOne({ user: mongoose.Types.ObjectId(user._id), follows: mongoose.Types.ObjectId(tag._id) })
            ]).then(([tag, user, follow]) => tag)
          }
        })
      }
    },
    // updateRepost: {
    //   type: RepostCaptionType,
    //   args: {
    //     repostData: { type: GraphQLJSONObject }
    //   },
    //   resolve(parentValue, {
    //     repostData
    //   }) {
    //     return Promise.all([
    //       RepostCaption.findById(repostData.captionId)
    //     ]).then(([foundCaption]) => {
    //       foundCaption.caption = repostData.repostCaption
          
    //       return foundCaption.save().then(caption => caption)
    //     })
    //   }
    // },
    updateRepost: {
      type: RepostType,
      args: {
        repostData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        repostData
      }) {
        return Promise.all([
          Repost.findById(repostData.repostedId)
            .populate('repostTrail')
            .then(repost => repost),
          RepostCaption.findById(repostData.captionId)
        ]).then(([foundRepost, foundCaption]) => {
          var repostObj = foundRepost.toObject()

          repostObj.repostTrail.forEach(obj => {
            if (obj._id === foundCaption._id) {
              obj.caption = repostData.repostCaption
            }
          })

          foundCaption.caption = repostData.repostCaption
          
          return foundCaption.save().then(() => {
            return repostObj
          })
        })
      }
    },
    repost: {
      type: RepostType,
      args: {
        repostData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        repostData
      }) {
        var repost = new Repost();
        
        return Promise.all([
          User.findOne({ blogName: repostData.user })
            .populate('profilePic')
            .then(user => user),
          User.findOne({ blogName: repostData.repostedFrom }),
          Post.findById(repostData.repostedId),
        ]).then(([reposter, reposted, foundPost]) => {

          var repostTrailUserObj = 
            repostData.previousReposter ?
            repostData.previousReposter :
            reposter
          
          var repostCaption = 
            repostData.repostCaption ?
            repostData.repostCaption :
            null
          
          var foundPostObj = foundPost ? foundPost.toObject() : null
          
          repost.postId = repostData.postId
          repost.post = repostData.postId
          repost.postAuthor = repostData.postAuthor
          repost.user = reposter._id
          repost.repostedFrom = reposted._id
          repost.onModel = repostData.postKind
          
          var caption = new RepostCaption({
            caption: repostCaption,
            user: reposter._id,
            repost: repost._id
          })

          if (foundPostObj && foundPostObj.kind === 'Repost') {
            foundPostObj.repostTrail.forEach(obj => {
              repost.repostTrail.push(obj._id)
            })
          }
          
          repost.repostTrail.push(caption._id)

          foundPost.notesCount = foundPost.notesCount + 1

          return Promise.all([
              repost.save(), 
              foundPost.save(), 
              caption.save()
            ])
            .then(([repost, post, caption]) => repost)
        })
      }
    },
    comment: {
      type: CommentType,
      args: {
        commentData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        commentData
      }) {
        var { user, postAuthorId, postId, content, kind } = commentData;
        var comment = new Comment();

        return Promise.all([
          User.findOne({ blogName: user }),
          Post.findById(postId)
        ]).then(([user, foundPost]) => {
          comment.user = user._id
          comment.post = postId
          comment.postAuthorId = postAuthorId
          comment.content = content
          comment.onModel = kind

          foundPost.notesCount = foundPost.notesCount + 1
          return Promise.all([comment.save(), foundPost.save()])
            .then(([comment, post]) => comment)
        })
      }
    },
    deleteComment: {
      type: CommentType,
      args: {
        commentId: { type: GraphQLID },
        postId: { type: GraphQLID },
      },
      resolve(parentValue, {
        commentId, postId
      }) {
        return Promise.all([
          Comment.deleteOne({ _id: commentId }),
          Post.findById(postId)
        ]).then(([comment, foundPost]) => {
          foundPost.notesCount = foundPost.notesCount - 1

          return foundPost.save().then(post => post)
        })
      }
    },
    updateProfilePic: {
      type: UserType,
      args: {
        instanceData: { type: GraphQLJSONObject }
      },
      resolve(parentValue, {
        instanceData
      }) {
        var { profilePicId, password, user } = instanceData;
        
        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              return Promise.all([
                Image.findOne({ _id: user.profilePic })
              ]).then(([foundImage]) => {
                if (foundImage) {
                  return Promise.all([
                    handleS3Cleanup(foundImage, s3Client, keys),
                    Image.deleteOne({ _id: foundImage._id })
                  ]).then(([cleaned, deletedImage]) => {
                    user.profilePic = profilePicId
  
                    return user.save().then(user => {
                      return user
                    })
                  })
                } else {
                  user.profilePic = profilePicId

                  return user.save().then(user => user)
                }
              })
            } else {
              return new Error('Incorrect password')
            }
          })
      }
    },
    updateUserEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        email, password, user
      }) {
        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              if (Validator.isURL(email)) {
                return User.findOne({ email: email })
                  .then(userExists => {
                    if (!userExists) {
                      user.email = email
                      return user.save()
                        .then(user => user)
                    } else {
                      return new Error('This email already exists')
                    }
                  })
              }
            }
          })
      }
    },
    updateUserBlogDescription: {
      type: UserType,
      args: {
        blogDescription: { type: GraphQLString },
        password: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        blogDescription, password, user
      }) {
        if (blogDescription.length < 150) {
          return User.findOne({ blogName: user })
            .then(user => {
              if (bcrypt.compareSync(password, user.password)) {
                user.blogDescription = blogDescription
                return user.save()
                  .then(user => user)
              } else {
                return new Error('Incorrect password')
              }
            })
        } else {
          return new Error('Blog Description must be 150 characters or less')
        }
      }
    },
    updateUserPassword: {
      type: UserType,
      args: {
        currentPW: { type: GraphQLString },
        newPassword: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        currentPW, newPassword, user
      }) {
        if (!Validator.isLength(newPassword, { min: 7, max: 33})) {
          return new Error("Password length must be between 8 and 32 characters")
        }

        return User.findOne({ blogName: user })
          .then(user => {
            if (bcrypt.compareSync(currentPW, user.password)) {
              var alreadyUsed = false

              user.oldPasswords.forEach(oldPw => {
                if (bcrypt.compareSync(newPassword, oldPw)) {
                  alreadyUsed = true
                }
              })

              if (!alreadyUsed) {
                return bcrypt.hash(newPassword, 10)
                  .then(newHash => {
                    user.oldPasswords.push(user.password)
                    user.password = newHash
                  })
              } else {
                throw new Error("Choose a password you haven't used before")
              }
            }
          })
      }
    },
    addFilterTag: {
      type: UserType,
      args: { 
        tag: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { tag, user }) {
        return User.findOne({ blogName: user })
          .then(user => {
      
            user.filteredTags.push(tag)
            
            var uniqArr = new Set(user.filteredTags)

            user.filteredTags = Array.from(uniqArr)

            return user.save()
              .then(user => user)
        })
      }
    },
    deleteFilterTag: {
      type: UserType,
      args: { 
        tag: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { tag, user }) {
        return User.findOne({ blogName: user })
        .then(user => {

          var filtered = user.filteredTags.filter(t => t !== tag)

          user.filteredTags = filtered

          return user.save()
            .then(user => user)
      })
      }
    },
    addFilterPostContent: {
      type: UserType,
      args: { 
        postContent: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { postContent, user }) {
        return User.findOne({ blogName: user })
          .then(user => {

            user.filteredPostContent.push(postContent)
            
            var uniqArr = new Set(user.filteredPostContent)

            user.filteredPostContent = Array.from(uniqArr)

            return user.save()
              .then(user => user)
        })
      }
    },
    deleteFilterPostContent: {
      type: UserType,
      args: { 
        postContent: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, { postContent, user }) {
        return User.findOne({ blogName: user })
        .then(user => {

          var filtered = user.filteredPostContent.filter(pc => pc !== postContent)

          user.filteredPostContent = filtered

          return user.save()
            .then(user => user)
      })
      }
    },
    deleteMyAccount: {
      type: GraphQLInt,
      args: {
        query: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
      },
      resolve(parentValue, { query, password, token }) {
        return User.findOne({ blogName: query })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
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
                { $replaceRoot: { "newRoot": "$posts" } }
              ]).then(posts => {
                return Promise.all([
                  asyncDeleteAllPosts(posts, deletePost, s3Client, keys),
                  asyncDeleteAllActivityAndProfilePic(user)
                ]).then(() => {
                  return AuthService.logout(token)
                    .then(() => {
                      return User.deleteOne({ blogName: query })
                        .then(obj => obj.n)
                    })
                  })
              })
            } else {
              throw new Error('Password is invalid')
            }
          })
      }
    }
  })
})

export default mutation;