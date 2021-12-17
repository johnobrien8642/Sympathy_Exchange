import mongoose from 'mongoose';
import graphql from 'graphql';
import bcrypt from 'bcryptjs';
import Validator from 'validator';
import aws from 'aws-sdk';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';

import keys from '../../../config/keys.js'
import UserType from '../objects/user_type.js';
import AuthService from '../../../services/auth_util.js';

import PleaInputType from '../inputs/plea_input_type.js';
import RegisterUserInputType from '../inputs/register_user_input_type.js';
import PleaType from '../objects/plea_type.js';
import SaveType from '../objects/save_type.js';
import PleaComboType from '../objects/plea_combo_type.js';
import PleaComboInputType from '../inputs/plea_combo_ll_node_input_type.js';
import SympathyType from '../objects/sympathy_type.js';
import FollowType from '../objects/follow_type.js';
import UserAndTagType from '../unions/user_and_tag_type.js';
import createOrUpdatePost from '../../../models/util/create_or_update_function.js';
import DeleteFunctionUtil from '../../../models/util/delete_function_util.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const { indexOf, isString, sortedIndex, clone } = lodash;
const { deletePost, 
        asyncDeleteAllPosts, 
        asyncDeleteAllActivityAndProfilePic,
        handleS3Cleanup, handles3AndObjectCleanup } = DeleteFunctionUtil;
//Streaks and Decimals last set 11/5/2021
const REG_DECIMAL_TO_ADD = .01;
const HOT_DECIMAL_TO_ADD = .1;
const HOT_STREAK_THRESH = 12;

const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Follow = mongoose.model('Follow');
const Plea = mongoose.model('Plea');
const Sympathy = mongoose.model('Sympathy');
const Save = mongoose.model('Save');
const { GraphQLObjectType, GraphQLID,
      GraphQLString, GraphQLList, GraphQLBoolean, GraphQLInt } = graphql;

var s3Client = new aws.S3({
  secretAccessKey: keys.secretAccessKey,
  accessKeyId: keys.accessKeyId,
  region: 'us-east-1'
})

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createOrChainPlea: {
      type: PleaType,
      args: {
        pleaInputData: { type: PleaInputType }
      },
      resolve(_, { pleaInputData }) {
        const { author, text, tagIds, pleaIdChain, chained } = pleaInputData;
        
        let plea = new Plea({
          author: author,
          text: text,
          chained: chained ? chained : false,
          pleaIdChain: pleaIdChain.length ? pleaIdChain : []
        });

        plea.pleaIdChain.push(plea._id)
        
        //tagIds array needs to always be sorted for filtering purposes.
        //See the filtering $eq query for more info.
        tagIds.sort().forEach(tagId => plea.tagIds.push(tagId));
        
        return plea.save();
      }
    },
    registerUser: {
      type: UserType,
      args: {
        registerUserInputData: { type: RegisterUserInputType }
      },
      resolve(_, { registerUserInputData }, ctx) {
        return AuthService.register(registerUserInputData, ctx).then(res => {
          ctx.headers.authorization = JSON.stringify(res.token)
          return res
        })
      }
    },
    generateUsername: {
      type: GraphQLString,
      resolve() {
        return AuthService.generateRandomUsername()
      }
    },
    loginUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args)
      }
    },
    logoutUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, { token }) {
        return AuthService.logout(token);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verify(args);
      }
    },
    recoverAccount: {
      type: UserType,
      args: {
        secretRecoveryPhrase: { type: GraphQLString }
      },
      resolve(_, { secretRecoveryPhrase }) {
        const hash = CryptoJS.SHA1(secretRecoveryPhrase).toString();

        return User.findOne({ secretRecoveryPhraseHash: hash })
          .then(user => {

            if (user) {
              const userDecoded = CryptoJS.AES.decrypt(user.secretRecoveryPhrase, keys.secretKeyForRecoveryPhrase).toString(CryptoJS.enc.Utf8);
              
              if (secretRecoveryPhrase === userDecoded) {
                const token = jwt.sign({ _id: user._id }, keys.secretOrKey)
                return { token, loggedIn: true, ...user._doc, ...user.username}
              }
            } else {
              throw new Error('That Secret Recovery Phrase is invalid.')
            }
          });
      }
    },
    sympathize: {
      type: PleaType,
      args: {
        pleaId: { type: GraphQLID },
        currentUserId: { type: GraphQLID }
      },
      async resolve(_, { pleaId, currentUserId }) {
        
        let plea =
          await Plea
            .findById(pleaId);

        let currentUser =
          await User
            .findById(currentUserId);
        
        const { _id } = plea;
        const twelveHoursAgo = new Date(new Date() - 43200000);
        
        const sympsForLastTwelveHours =
          await Sympathy
            .find(
              {
                $and: [
                  { _id: { $eq: _id } },
                  { createdAt: { $gt: twelveHoursAgo } }
                ]
              }
            );
            
        if (sympsForLastTwelveHours.length > HOT_STREAK_THRESH) {
          plea.hotStreakTicker += 1
          
          if (plea.hotStreakTicker > 5) {
            const newFloat = (parseFloat(plea.sympathyCount.toString()) + HOT_DECIMAL_TO_ADD);
            plea.sympathyCount = newFloat.toFixed(3);
            plea.hotStreakTicker = 0;
          }
        } else if (sympsForLastTwelveHours.length < HOT_STREAK_THRESH) {
          plea.hotStreakTicker = 0;
          plea.sympathyCountTicker += 1;
          
          if (plea.sympathyCountTicker > 4) {
            const newFloat = (parseFloat(plea.sympathyCount.toString()) + REG_DECIMAL_TO_ADD);
            plea.sympathyCount = newFloat.toFixed(3);
            plea.sympathyCountTicker = 0;
          }
        }
            
        const symp = new Sympathy({
          plea: _id,
          user: currentUserId
        });
        
        currentUser.sympathizedPleaIdStringArr.splice(sortedIndex(currentUser.sympathizedPleaIdStringArr, plea._id), 0, plea._id);
        
        await currentUser.save();
        await symp.save();
        return await plea.save();
      }
    },
    unsympathize: {
      type: PleaType,
      args: {
        pleaId: { type: GraphQLID },
        currentUserId: { type: GraphQLID }
      },
      async resolve(_, { pleaId, currentUserId }) {
        let plea = 
          await Plea
            .findById(pleaId);

        let currentUser = 
          await User
            .findById(currentUserId);
        
        const symp = new Sympathy({
          plea: pleaId,
          user: currentUserId,
          unsympathy: true
        });
        
        currentUser.sympathizedPleaIdStringArr.splice(sortedIndex(currentUser.sympathizedPleaIdStringArr, plea._id), 1);
        await currentUser.save();
        await symp.save();

        let float = plea.sympathyCount.toString();

        //if sympathyCountTicker is already at 0
        //then penalize sympathyCount
        if (plea.sympathyCountTicker === 0) {
          //if float is 0 then do nothing
          if (!float) {
            return
          } else {
            const newFloat = (float - REG_DECIMAL_TO_ADD);
            plea.sympathyCount = newFloat.toString();
            return await plea.save();
          }
        } else {
          //if sympathyCountTicker > 0 then only penalize
          //sympathyCountTicker, sympathyCount is safe
          plea.sympathyCountTicker -= 1;
          return await plea.save();
        }
      }
    },
    save: {
      type: SaveType,
      args: {
        pleaId: { type: GraphQLID },
        currentUserId: { type: GraphQLID }
      },
      async resolve(_, { pleaId, currentUserId }) {
        let plea =
          await Plea
            .findById(pleaId);

        let currentUser =
          await User
            .findById(currentUserId);
        
        const { _id } = plea;
            
        const save = new Save({
          plea: _id,
          user: currentUserId
        });
        
        currentUser.savedPleaIdsStringArr.splice(sortedIndex(currentUser.savedPleaIdsStringArr, plea._id), 0, plea._id);
        
        await currentUser.save();
        return await save.save();
      }
    },
    unsave: {
      type: UserType,
      args: {
        pleaId: { type: GraphQLID },
        currentUserId: { type: GraphQLID }
      },
      async resolve(_, { pleaId, currentUserId }) {
        await Save.deleteOne({
              plea: pleaId,
              user: currentUserId
            });

        let currentUser = 
          await User
            .findById(currentUserId);
        
        currentUser.savedPleaIdsStringArr.splice(sortedIndex(currentUser.savedPleaIdsStringArr, pleaId), 1);

        return await currentUser.save();
      }
    },
    follow: {
      type: UserAndTagType,
      args: {
        currentUserArg: { type: GraphQLString },
        item: { type: GraphQLString },
        itemKind: { type: GraphQLString }
      },
      async resolve(_, { currentUserArg, item, itemKind }) {
        let follow = new Follow({
          onModel: itemKind
        })
        const recastItem = mongoose.Types.ObjectId(item);
        
        const currentUser = await User.findOne({ _id: currentUserArg });
        const userToFollow = await User.findOne({ _id: recastItem });
        const tagToFollow = await Tag.findOne({ _id: recastItem });
        
        follow.user = currentUser._id;
        
        if (userToFollow) {
          follow.follows = userToFollow._id;
          currentUser.userFollows.push(userToFollow._id);

          await follow.save();
          await currentUser.save();
          
          return userToFollow;
        } else if (tagToFollow) {
          follow.follows = tagToFollow._id;
          currentUser.tagFollows.push(tag._id);

          await follow.save();
          await currentUser.save();

          return tagToFollow;
        }
      }
    },
    unfollow: {
      type: UserAndTagType,
      args: {
        currentUserArg: { type: GraphQLString },
        item: { type: GraphQLID }
      },
      async resolve(_, { currentUserArg, item }) {
        const recastItem = mongoose.Types.ObjectId(item);

        const currentUser = await User.findOne({ _id: currentUserArg });
        const userToUnfollow = await User.findOne({ _id: recastItem });
        const tagToUnfollow = await Tag.findOne({ _id: recastItem });

        if (userToUnfollow) {
          currentUser.userFollows =
            currentUser.userFollows.filter(obj => obj._id.toString() !== userToUnfollow._id.toString());

          await currentUser.save();
          await Follow.deleteOne({ 
            user: mongoose.Types.ObjectId(currentUser._id), 
            follows: mongoose.Types.ObjectId(userToUnfollow._id) 
          });
          
          return userToUnfollow;
        } else if (tagToUnfollow) {
          currentUser.tagFollows = 
            currentUser.tagFollows.filter(obj => obj._id.toString() !== tagToUnfollow._id.toString());

          await currentUser.save();
          Follow.deleteOne({ 
            user: mongoose.Types.ObjectId(currentUser._id), 
            follows: mongoose.Types.ObjectId(tagToUnfollow._id)
          });
          
          return tagToUnfollow;
        }
      }
    },
    // createOrUpdatePost: {
    //   type: PleaOrVariantType,
    //   args: {
    //     instanceData: { type: GraphQLJSONObject },
    //   },
    //   resolve(_, { instanceData }) {
    //     return createOrUpdatePost(instanceData)
    //   }
    // },
    // deletePost: {
    //   type: GraphQLID,
    //   args: {
    //     post: { type: GraphQLJSONObject }
    //   },
    //   resolve(_, { post }) {
    //     return deletePost(
    //       post,
    //       s3Client,
    //       keys,
    //       handles3AndObjectCleanup
    //     )
    //   }
    // },
    // likePost: {
    //   type: LikeType,
    //   args: {
    //     postId: { type: GraphQLID },
    //     user: { type: GraphQLString },
    //     postKind: { type: GraphQLString }
    //   },
    //   resolve(_, { postId, user, postKind }) {
    //     var like = new Like();
        
    //     return Promise.all([
    //       User.findOne({ blogName: user }),
    //       Plea.findById(postId)
    //     ]).then(([user, foundPost]) => {
    //       like.user = user._id
    //       like.post = postId
    //       like.postAuthor = foundPost.user._id
    //       like.onModel = postKind

    //       foundPost.notesCount = foundPost.notesCount + 1
    //       return Promise.all(([like.save(), foundPost.save()]))
    //         .then(([like, post]) => (like))
    //     })
    //   }
    // },
    // unlikePost: {
    //   type: LikeType,
    //   args: {
    //     likeId: { type: GraphQLID },
    //     postId: { type: GraphQLID }
    //   },
    //   resolve(_, { likeId, postId }) {
        
    //     return Promise.all([
    //       Plea.findById(postId),
    //       Like.deleteOne({ _id: likeId })
    //     ]).then(([foundPost, like]) => {
    //       foundPost.notesCount = foundPost.notesCount - 1

    //       return foundPost.save().then(post => post)
    //     })
    //   }
    // },
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
    // updateRepost: {
    //   type: RepostType,
    //   args: {
    //     repostData: { type: GraphQLJSONObject }
    //   },
    //   resolve(parentValue, {
    //     repostData
    //   }) {
    //     return Promise.all([
    //       Repost.findById(repostData.repostedId)
    //         .populate('repostTrail')
    //         .then(repost => repost),
    //       RepostCaption.findById(repostData.captionId)
    //     ]).then(([foundRepost, foundCaption]) => {
    //       var repostObj = foundRepost.toObject()

    //       repostObj.repostTrail.forEach(obj => {
    //         if (obj._id === foundCaption._id) {
    //           obj.caption = repostData.repostCaption
    //         }
    //       })

    //       foundCaption.caption = repostData.repostCaption
          
    //       return foundCaption.save().then(() => {
    //         return repostObj
    //       })
    //     })
    //   }
    // },
    // repost: {
    //   type: RepostType,
    //   args: {
    //     repostData: { type: GraphQLJSONObject }
    //   },
    //   resolve(parentValue, {
    //     repostData
    //   }) {
    //     var repost = new Repost();
        
    //     return Promise.all([
    //       User.findOne({ blogName: repostData.user })
    //         .populate('profilePic')
    //         .then(user => user),
    //       User.findOne({ blogName: repostData.repostedFrom }),
    //       Plea.findById(repostData.repostedId),
    //     ]).then(([reposter, reposted, foundPost]) => {

    //       var repostTrailUserObj = 
    //         repostData.previousReposter ?
    //         repostData.previousReposter :
    //         reposter
          
    //       var repostCaption = 
    //         repostData.repostCaption ?
    //         repostData.repostCaption :
    //         null
          
    //       var foundPostObj = foundPost ? foundPost.toObject() : null
          
    //       repost.postId = repostData.postId
    //       repost.post = repostData.postId
    //       repost.postAuthor = repostData.postAuthor
    //       repost.user = reposter._id
    //       repost.repostedFrom = reposted._id
    //       repost.onModel = repostData.postKind
          
    //       var caption = new RepostCaption({
    //         caption: repostCaption,
    //         user: reposter._id,
    //         repost: repost._id
    //       })

    //       if (foundPostObj && foundPostObj.kind === 'Repost') {
    //         foundPostObj.repostTrail.forEach(obj => {
    //           repost.repostTrail.push(obj._id)
    //         })
    //       }
          
    //       repost.repostTrail.push(caption._id)

    //       foundPost.notesCount = foundPost.notesCount + 1

    //       return Promise.all([
    //           repost.save(), 
    //           foundPost.save(), 
    //           caption.save()
    //         ])
    //         .then(([repost, post, caption]) => repost)
    //     })
    //   }
    // },
    updateUsername: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        user: { type: GraphQLString }
      },
      resolve(parentValue, {
        username, password, user
      }) {
        return User.findOne({ username: user })
          .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
              user.username = username
              return user.save()
                .then(user => user)
            }
          })
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
        
        return User.findOne({ username: user })
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

                    user.markModified('oldPasswords')
                    return user.save().then(user => user)
                  })
              } else {
                throw new Error("Choose a password you haven't used before")
              }
            } else {
              throw new Error("Current password is incorrect")
            }
          })
      }
    },
    // addFilterTag: {
    //   type: UserType,
    //   args: { 
    //     tag: { type: GraphQLString },
    //     user: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { tag, user }) {
    //     return User.findOne({ blogName: user })
    //       .then(user => {
      
    //         user.filteredTags.push(tag)
            
    //         var uniqArr = new Set(user.filteredTags)

    //         user.filteredTags = Array.from(uniqArr)

    //         return user.save()
    //           .then(user => user)
    //     })
    //   }
    // },
    // deleteFilterTag: {
    //   type: UserType,
    //   args: { 
    //     tag: { type: GraphQLString },
    //     user: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { tag, user }) {
    //     return User.findOne({ blogName: user })
    //     .then(user => {

    //       var filtered = user.filteredTags.filter(t => t !== tag)

    //       user.filteredTags = filtered

    //       return user.save()
    //         .then(user => user)
    //   })
    //   }
    // },
    // addFilterPostContent: {
    //   type: UserType,
    //   args: { 
    //     postContent: { type: GraphQLString },
    //     user: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { postContent, user }) {
    //     return User.findOne({ blogName: user })
    //       .then(user => {

    //         user.filteredPostContent.push(postContent)
            
    //         var uniqArr = new Set(user.filteredPostContent)

    //         user.filteredPostContent = Array.from(uniqArr)

    //         return user.save()
    //           .then(user => user)
    //     })
    //   }
    // },
    // deleteFilterPostContent: {
    //   type: UserType,
    //   args: { 
    //     postContent: { type: GraphQLString },
    //     user: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { postContent, user }) {
    //     return User.findOne({ blogName: user })
    //     .then(user => {

    //       var filtered = user.filteredPostContent.filter(pc => pc !== postContent)

    //       user.filteredPostContent = filtered

    //       return user.save()
    //         .then(user => user)
    //   })
    //   }
    // },
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