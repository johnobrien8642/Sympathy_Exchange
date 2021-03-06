import mongoose from 'mongoose';
import graphql from 'graphql';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import strsim from 'string-similarity';
import keys from '../../../../config/keys.js'
import UserType from '../objects/user_type.js';
import FollowType from '../objects/follow_type.js';
import FilterParameterType from '../objects/filter_parameter_type.js';
import TagType from '../objects/tag_type.js';
import UserTagUnionType from '../unions/user_tag_union_type.js';
import UserAndTagInputType from '../inputs/user_and_tag_input_type.js';
import PleaUserTagUnionType from '../unions/plea_user_tag_union_type.js';
import PleaSaveLikeFollowUnionType from '../unions/plea_save_like_follow_union_type.js';
import FilterInputType from '../inputs/filter_input_type.js';
import FetchFeedInputType from '../inputs/fetch_feed_input_type.js';
import SearchInputType from '../inputs/search_input_type.js';
import PleaType from '../objects/plea_type.js';
import SympathyType from '../objects/sympathy_type.js';
import SearchUtil from '../../../services/search_util.js';
import RootQueryTypeUtil from './util/root_query_type_util.js';
import e from 'express';
const User = mongoose.model('User');
const Plea = mongoose.model('Plea');
const Tag = mongoose.model('Tag');
const Sympathy = mongoose.model('Sympathy');
const Follow = mongoose.model('Follow');
const Save = mongoose.model('Save');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean } = graphql;
// const { handleFilterTagRegex, 
//         handleFilterPostContentRegex,
//         asyncTagPostArr,
//         asyncFetchTagPosts } = RootQueryTypeUtil;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    usersAndTags: {
      type: GraphQLList(UserTagUnionType),
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
                
                const filteredTags = tags.filter(tag =>
                  !user.tagFollows.includes(tag._id)
                )

                const filteredUsers = users.filter(tag =>
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
    fetchSecretRecoveryPhraseAfterRegister: {
      type: GraphQLString,
      args: { timedToken: { type: GraphQLString } },
      async resolve(_, { timedToken }) {
        const decoded = await jwt.verify(timedToken, keys.secretOrKey);
        const { secretRecoveryPhrase } = decoded;

        return User.findOne({ secretRecoveryPhrase: secretRecoveryPhrase })
          .then(user => {
            if (user) {
              const bytes = CryptoJS.AES.decrypt(user.secretRecoveryPhrase, keys.secretKeyForRecoveryPhrase);
              return bytes.toString(CryptoJS.enc.Utf8);
            }
          });
      }
    },
    fetchSecretRecoveryPhrase: {
      type: GraphQLString,
      args: { token: { type: GraphQLString } },
      async resolve(_, { token }) {
        const decoded = await jwt.verify(token, keys.secretOrKey);
        const { _id } = decoded;

        return User.findById(_id)
          .then(user => {
            return CryptoJS.AES.decrypt(user.secretRecoveryPhrase, keys.secretKeyForRecoveryPhrase).toString(CryptoJS.enc.Utf8);
          })
      }
    },
    fetchFeed: {
      type: GraphQLList(PleaSaveLikeFollowUnionType),
      args: { fetchFeedInputs: { type: FetchFeedInputType } },
      async resolve(_, { fetchFeedInputs }) {
        const { filter, cursor, altCursor, tagId, userId, searchInput, activity } = fetchFeedInputs;
        let { floor, ceiling, rangeArr, 
                tagIdArr, bySympCount, byTagIds, 
                bySympathizedPleaIds, bySavedPleaIds, 
                byUserFollows, byTagFollows, 
                bySympathizedPleaIdsArr, bySavedPleaIdsArr, 
                byUserFollowsArr, byTagFollowsArr, feedSort } = filter;
        let query = { $and: [] };
        let sort;
        let byCurrentUserPleas = !!userId;
        
        if ([bySympathizedPleaIds, bySavedPleaIds, byUserFollows, byTagFollows].some(filterKey => !!filterKey)) {
          byCurrentUserPleas = false;
        };

        if (tagId) {
          byTagIds = true;
          tagIdArr.push(tagId);
        };

        if (byCurrentUserPleas) {
          query.$and.push({ authorId: { $eq: userId } });
        };

        if (byTagIds) {
          query.$and.push({ tagIds: { $in: tagIdArr } });
        };

        if (bySympCount) {
          query.$and.push(
            { combinedSympathyCount: { $gte: rangeArr[0] } },
            { combinedSympathyCount: { $lte: rangeArr[1] } },
            { sympathyCount: { $gte: rangeArr[0] } },
            { sympathyCount: { $lte: rangeArr[1] } }
          );
        };

        if (cursor) {
          query.$and.push(
            { combinedSympathyCount: { $lte: cursor } },
            { sympathyCount: { $lte: cursor } }
          );
        };
      
        if (byTagIds) {
          query.$and.push({ tagIds: { $in: tagIdArr } });
        };

        if (bySympathizedPleaIds) {
          query.$and.push({ _id: { $in: bySympathizedPleaIdsArr } });
        };

        if (bySavedPleaIds) {
          query.$and.push({ _id: { $in: bySavedPleaIdsArr } });
        };
        
        if (byUserFollows) {
          query.$and.push({ authorId: { $in: byUserFollowsArr } });
        };

        if (byTagFollows) {
          query.$and.push({ tagIds: { $in: byTagFollowsArr } });
        };

        if (searchInput) {
          query.$and.push(
            {
              $or: [
                { text: { $regex: searchInput, $options: 'im' } },
                { authorUsername: { $regex: searchInput, $options: 'im' } }
              ]
            }
          )
        }

        // // sort() params
        const bySympathyCount = feedSort === 'bySympathyCount';
        const byCreatedAt = feedSort === 'byCreatedAt';

        if (bySympathyCount) {
          sort = { combinedSympathyCount: -1, sympathyCount: -1, createdAt: -1 }
        } else if (byCreatedAt) {
          sort = { createdAt: -1 }
        };
        
        //If we never pushed any query objects into $and,
        //then reset query to an object to find all
        if (!query.$and.length) {
          query = {}
        };
        
        if (activity) {
          query = { $and: [ { pleaAuthorId: userId } ] };
          
          if (altCursor) {
            query.$and.push({ _id: { $lt: altCursor } })
          };
          
          let saves = await Save.find(query).limit(20);
          let symps = await Sympathy.find(query).limit(20);
          let follows = await Follow.find({ follows: userId }).limit(20);
          
          const arr = [...saves, ...symps, ...follows].sort((a, b) => b.createdAt - a.createdAt);
          if (arr.length > 30) {
            return arr.slice(0, 30);
          } else {
            return arr;
          };
        } else {
          return await Plea.find(query)
            .limit(10)
            .sort(sort);
        };
      }
    },
    recents: {
      type: GraphQLList(PleaType),
      async resolve(_) {
        return await Plea.find({})
          .limit(5)
          .sort({ createdAt: -1 })
      }
    },
    fetchMaxParameterForFilter: {
      type: FilterParameterType,
      args: { tagId: { type: GraphQLID } },
      async resolve(_, { tagId }) {
        let query;
        
        if (tagId) {
          query = {
            tagIds: { 
              $in: [ mongoose.Types.ObjectId(tagId) ] 
            }
          }
        } else {
          query = {}
        };

        return await Plea.find(query)
          .sort({ 'sympathyCount': -1 })
          .limit(1)
          .then(res => {
            try {
              var digits = new RegExp(/^(?:\d+)/, 'g'),
              regex = digits.exec(res[0].sympathyCount),
              ceil, divisor, ceilingNum;

              divisor = res[0].sympathyCount < 100 ? 10 : 100;
            
              ceil = Math.ceil(res[0].sympathyCount/divisor); 
              ceilingNum = Math.ceil(parseFloat(res[0].sympathyCount.toString()));
            
              return { ceiling: ceilingNum, integerLength: regex[0].toString().length };  
            } catch(err) {
              throw new Error('We were unable to fetch filter parameters at this time. Please try again later.')
            }
          });
      }
    },
    fetchAllTags: {
      type: GraphQLList(TagType),
      async resolve(_) {
        return await Tag.find({})
      }
    },
    fetchSearchResults: {
      type: GraphQLList(PleaUserTagUnionType),
      args: { searchInput: { type: GraphQLString } },
      async resolve(_, { searchInput }) {
        const users = await User.find({ username: { $regex: searchInput, $options: 'im' } }).limit(8);
        const pleas = await Plea.find({ $or: [
            { authorUsername: { $regex: searchInput, $options: 'im' } },
            { text: { $regex: searchInput, $options: 'im' } }
          ]
        }).limit(8);
        const tags = await Tag.find({ title: { $regex: searchInput, $options: 'im' } }).limit(8);

        return [...users, ...pleas, ...tags].sort((a, b) => {
          let compA, compB;
          if (a.kind === 'User') {
            compA = a.username;
          } else if (a.kind === 'Plea') {
            compA = a.text;
          } else if (a.kind === 'Tag') {
            compA = a.title;
          }

          if (b.kind === 'User') {
            compB = b.username;
          } else if (b.kind === 'Plea') {
            compB = b.text;
          } else if (b.kind === 'Tag') {
            compB = b.title;
          }

          return strsim.compareTwoStrings(searchInput, compA) - strsim.compareTwoStrings(searchInput, compB);
        });
      }
    },
    // fetchMatchingTags: {
    //   type: new GraphQLList(TagType),
    //   args: { filter: { type: GraphQLString } },
    //   resolve(_, {filter}) {
    //     if (filter === '') {
    //       return [];
    //     }
    //     let query = {};
    //     query.title = new RegExp(filter);
        
    //     const tags = async (query) => {
    //       return await Tag.find(query).limit(5).exec()
    //     }

    //     return Promise.all([tags(query)]).then(([tags]) => {
    //       return [...tags]
    //     })
    //   }
    // },
    // fetchUserLikes: {
    //   type: GraphQLList(LikeType),
    //   args: {
    //     query: { type: GraphQLString }
    //   },
    //   resolve(_, { query }) {
    //     return User
    //       .aggregate([
    //         { $match: { blogName: query } },
    //         {
    //           $lookup: {
    //             from: 'likes',
    //             localField: '_id',
    //             foreignField: 'user',
    //             as: 'likes'
    //           }
    //         },
    //         { $unwind: '$likes' },
    //         { $replaceRoot: { "newRoot": '$likes' } }
    //       ]).then(res => res)
    //   }
    // },
    // doesUserLikePost: {
    //   type: LikeType,
    //   args: {
    //     user: { type: GraphQLString },
    //     postId: { type: GraphQLID }
    //   },
    //   resolve(_, {user, postId}) {
    //     var recastPostId = mongoose.Types.ObjectId(postId)

    //     return User.aggregate([
    //       { $match: { blogName: user } },
    //       {
    //         $lookup: {
    //           from: 'likes',
    //           let: { userId: "$_id", postId: recastPostId },
    //           pipeline: [
    //             { $match: {
    //                 $expr: {
    //                   $and: 
    //                     [
    //                       { $in: [ "$user", "$$userId" ] },
    //                       { $eq: [ "$post", "$$postId" ] }
    //                     ]
    //                 }
    //               }
    //             },
    //           ],
    //           as: "like"
    //         }
    //       },
    //       { $unwind: "$like" },
    //       { $replaceRoot: { "newRoot": "$like" } }
    //     ]).then(res => res[0])
    //   }
    // },
    // doesUserFollowUser: {
    //   type: FollowType,
    //   args: {
    //     user: { type: GraphQLString },
    //     otherUser: { type: GraphQLString }
    //   },
    //   resolve(_, {user, otherUser}) {
    //     return Promise.all(([
    //       User.find({
    //         blogName: {
    //           $in: [user, otherUser]
    //         }
    //       })
    //     ])).then(users => {
    //         const foundUser = user === users[0][0].blogName ? users[0][0] : users[0][1];
    //         const foundOtherUser = otherUser === users[0][0].blogName ? users[0][0] : users[0][1];
          
    //         return Promise.all(([
    //           Follow
    //           .aggregate([
    //             {
    //               $lookup: {
    //                 from: 'follows',
    //                 let: { user: foundUser._id, otherUser: foundOtherUser._id },
    //                 pipeline: [
    //                     { $match: {
    //                       $expr: {
    //                         $and: 
    //                         [
    //                           { $eq: [ "$user", "$$user" ] },
    //                           { $eq: [ "$follows", "$$otherUser" ] }
    //                         ]
    //                       }
    //                     }
    //                   }
    //                 ],
    //                 as: 'follow'
    //               }
    //             },
    //             { $unwind: "$follow" },
    //             { $replaceRoot: { "newRoot": "$follow" } }
    //           ])
    //         ])).then(res => res[0][0])
    //       })
    //   }
    // },
    // doesUserFollowTag: {
    //   type: FollowType,
    //   args: {
    //     query: { type: GraphQLString },
    //     tagId: { type: GraphQLID }
    //   },
    //   resolve(_, { query, tagId }) {
    //     var recastTagId = mongoose.Types.ObjectId(tagId)
        
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       { $lookup: {
    //           from: 'follows',
    //           let: { userId: '$_id', tagId: recastTagId },
    //           pipeline: [
    //             { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $eq: [ "$user", "$$userId" ] },
    //                     { $eq: [ "$follows", "$$tagId" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: "followed"
    //         }
    //       },
    //       { $unwind: "$followed" },
    //       { $replaceRoot: { "newRoot": "$followed" } }
    //     ]).then(res => {
    //       return res[0]
    //     })
    //   }
    // },
    // fetchUserFeed: {
    //   type: new GraphQLList(PleaOrVariantType),
    //   args: { 
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(_, { query, cursorId }) {
    //     return User.findOne({ blogName: query })
    //       .populate('tagFollows')
    //       .then(user => {
    //         return Follow.find({ user: user, onModel: 'User' })
    //           .then(follows => {
                
    //             var filteredTagRegex = handleFilterTagRegex(user)
                
    //             var filteredPostContentRegex = handleFilterPostContentRegex(user)
           
    //             var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))

    //             var recastPostId;
    //             recastPostId = mongoose.Types.ObjectId(cursorId)
                
    //             return Post.aggregate([
    //               { 
    //                 $lookup: {
    //                   from: 'posts',
    //                   let: { 
    //                     userId: user._id,
    //                     follows: followIds,
    //                     cursor: recastPostId,
    //                     filteredTagRegex: filteredTagRegex,
    //                     filteredPostContentRegex: filteredPostContentRegex
    //                   },
    //                   pipeline: [
    //                     {
    //                       $match: {
    //                         $expr: {
    //                           $and: [
    //                             { $lt: [ "$_id", "$$cursor" ] },
    //                             { $not: [
    //                                   {
    //                                     $regexMatch: {
    //                                       input: "$tagTitles",
    //                                       regex: "$$filteredTagRegex"
    //                                     }
    //                                   }
    //                                 ]
    //                               },
    //                             { $not: [
    //                                   {
    //                                     $regexMatch: {
    //                                       input: "$allText",
    //                                       regex: "$$filteredPostContentRegex"
    //                                     }
    //                                   }
    //                                 ]
    //                               },
    //                               { $or: [
    //                                 { $eq: [ "$user", "$$userId" ] },
    //                                 { $in: [ "$user", "$$follows" ] },
    //                               ]
    //                             }
    //                           ]
    //                         }
    //                       }
    //                     }
    //                   ],
    //                   as: 'posts'
    //                 }
    //               },
    //               { $unwind: '$posts' },
    //               { $replaceRoot: { "newRoot": "$posts" } },
    //               { $sort: { "createdAt": -1 } },
    //               { $limit: 50 }
    //             ]).then(res => {
    //               return res
    //             })
    //           })
    //       })
    //   }
    // },
    // fetchTagFeed: {
    //   type: new GraphQLList(PleaOrVariantType),
    //   args: { 
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(_, { query }) {
    //     var hashedQuery = '#' + query

    //     return Tag.aggregate([
    //       { $match: { title: hashedQuery } },
    //           { $lookup: {
    //               from: 'posts',
    //               localField: '_id',
    //               foreignField: 'tagIds',
    //               as: 'postsWithTag'
    //             }
    //           },
    //           { $unwind: "$postsWithTag" },
    //           { $replaceRoot: { "newRoot": "$postsWithTag" } },
    //           { $sort: { "createdAt": -1 } }
    //     ]).then(res => res)
    //   }
    // },
    // fetchLikesRepostsAndComments: {
    //   type: new GraphQLList(LikeRepostAndCommentType),
    //   args: { postId: { type: GraphQLID } },
    //   resolve(parentValue, { postId }) {
    //     var recastPostId = mongoose.Types.ObjectId(postId)
    //     return Post.aggregate([
    //       { $match: { _id: recastPostId } },
    //       {
    //         $lookup: {
    //           from: 'likes',
    //           localField: '_id',
    //           foreignField: 'post',
    //           as: 'likes'
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'comments',
    //           localField: '_id',
    //           foreignField: 'post',
    //           as: 'comments'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'posts',
    //           let: { postId: '$_id', postKind: 'Repost' },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $eq: [ "$post", "$$postId" ] },
    //                     { $eq: [ "$kind", "$$postKind" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'reposts'
    //         }
    //       },
    //       { $addFields: { 
    //           notes: { 
    //             $concatArrays: [ 
    //               "$likes", "$reposts", "$comments"
    //             ] 
    //           } 
    //         } 
    //       },
    //       { $unwind: "$notes" },
    //       { $replaceRoot: { "newRoot": "$notes" } },
    //       { $sort: { "createdAt": 1 } },
    //       { $limit: 25 }
    //     ]).then(res => res)
    //   }
    // },
    // fetchUsersForMentions: {
    //   type: GraphQLList(UserType),
    //   args: { filter: { type: GraphQLString } },
    //   resolve(parentValue, { filter }) {
    //     if (filter === '') {
    //       return [];
    //     }
    //     let query = {};
    //     query.blogName = new RegExp(filter);
        
    //     const users = async (query) => {
    //       return await User.find(query).limit(7).exec()
    //     }

    //     return Promise.all([users(query)]).then(([users]) => {
    //       return [...users]
    //     }) 
    //   }
    // },
    // fetchAllUserActivity: {
    //   type: GraphQLList(AnyActivityType),
    //   args: { 
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query, cursorId }) {
    //     var recastPostId = mongoose.Types.ObjectId(cursorId)
        
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       {
    //         $lookup: {  
    //           from: 'mentions',
    //           let: { userId: '$_id', cursor: recastPostId },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $lt: [ "$_id", "$$cursor" ] },
    //                     { $eq: [ "$mention", "$$userId" ] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'mentions'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'posts',
    //           let: { userId: '$_id', cursor: recastPostId, kind: 'Repost' },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $lt: [ "$_id", "$$cursor" ] },
    //                     { $eq: [ "$repostedFrom", "$$userId" ] },
    //                     { $eq: [ "$kind", "$$kind" ] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'reposts'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'comments',
    //           let: { userId: '$_id', cursor: recastPostId },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $eq: [ "$postAuthorId", "$$userId" ] },
    //                     { $lt: [ "$_id", "$$cursor" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'comments'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'follows',
    //           let: { userId: '$_id', cursor: recastPostId },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $eq: [ "$follows", "$$userId" ] },
    //                     { $lt: [ "$_id", "$$cursor" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'follows'
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'likes',
    //           let: { userId: '$_id', cursor: recastPostId },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and: 
    //                   [
    //                     { $eq: [ "$postAuthor", "$$userId" ] },
    //                     { $lt: [ "$_id", "$$cursor" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'likes'
    //         }
    //       },
    //       { $addFields: { 
    //           allActivity: { 
    //             $concatArrays: [ 
    //               "$mentions", "$reposts", "$comments", "$follows", "$likes"
    //             ] 
    //           } 
    //         } 
    //       },
    //       { $unwind: "$allActivity" },
    //       { $replaceRoot: { "newRoot": "$allActivity" } },
    //       { $sort: { "createdAt": -1 } },
    //       { $limit: 25 }
    //     ]).then(res => {
    //       return res
    //     })
    //   }
    // },
    // fetchActivityCount: {
    //   type: GraphQLInt,
    //   args: { 
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query, cursorId }) {
    //     var dateNum = parseInt(cursorId)
        
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       {
    //         $lookup: {  
    //           from: 'mentions',
    //           let: { userId: '$_id', cursorId: new Date(dateNum) },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $gt: [ "$createdAt", "$$cursorId"]},
    //                     { $eq: [ "$mention", "$$userId" ] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'mentions'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'posts',
    //           let: { userId: '$_id', kind: 'Repost', cursorId: new Date(dateNum) },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $gt: [ "$createdAt", "$$cursorId"]},
    //                     { $eq: [ "$kind", "$$kind" ] },
    //                     { $eq: [ "$postAuthor", "$$userId" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'reposts'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'comments',
    //           let: { userId: '$_id', cursorId: new Date(dateNum) },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $gt: [ "$createdAt", "$$cursorId"]},
    //                     { $eq: [ "$user", "$$postAuthorId" ] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'comments'
    //         }
    //       },
    //       {
    //         $lookup: {  
    //           from: 'likes',
    //           let: { userId: '$_id', cursorId: new Date(dateNum) },
    //             pipeline: [
    //               { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $gt: [ "$createdAt", "$$cursorId"]},
    //                     { $eq: [ "$user", "$$postAuthor" ] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'likes'
    //         }
    //       },
    //       {
    //         $project: {
    //           mentionsCount: { $size: "$mentions" },
    //           repostsCount: { $size: "$reposts" },
    //           commentsCount: { $size: "$comments" },
    //           likesCount: { $size: "$likes" },
    //         }
    //       }
    //     ]).then(res => {
    //       return res[0].mentionsCount + 
    //       res[0].repostsCount + 
    //       res[0].commentsCount + 
    //       res[0].likesCount
    //     })
    //   }
    // },
    // fetchUserFollowers: {
    //   type: GraphQLList(FollowType),
    //   args: {
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query, cursorId }) {
    //     var recastPostId = mongoose.Types.ObjectId(cursorId)
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       { $lookup: {
    //         from: 'follows',
    //         let: { 
    //           userId: '$_id', 
    //           cursorId: recastPostId, 
    //           onModel: 'User'
    //         },
    //           pipeline: [
    //             { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $lt: [ "$_id", "$$cursorId"]},
    //                     { $eq: [ "$follows", "$$userId" ] },
    //                     { $eq: [ "$onModel", "$$onModel" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'followers'
    //         }
    //       },
    //       { $unwind: "$followers" },
    //       { $replaceRoot: { "newRoot": "$followers" } },
    //       { $sort: { "createdAt": -1 } },
    //       { $limit: 100 }
    //     ]).then(res => {
    //       return res
    //     })
    //   }
    // },
    // fetchUserBlogFeed: {
    //   type: GraphQLList(PleaOrVariantType),
    //   args: {
    //     query: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query }) {
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       { $lookup: {
    //           from: 'posts',
    //           localField: '_id',
    //           foreignField: 'user',
    //           as: 'posts'
    //         }
    //       },
    //       { $unwind: '$posts' },
    //       { $replaceRoot: { "newRoot": "$posts" } },
    //       { $sort: { "createdAt": -1 } } 
    //     ]).then(res => {
    //       return res          
    //     })
    //   }
    // },
    // fetchFollowedUsers: {
    //   type: GraphQLList(FollowType),
    //   args: {
    //     query: { type: GraphQLString },
    //     cursorId: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query, cursorId }) {
    //     var recastPostId = mongoose.Types.ObjectId(cursorId)
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       { $lookup: {
    //         from: 'follows',
    //         let: { 
    //           userId: '$_id', 
    //           cursorId: recastPostId, 
    //           onModel: 'User' 
    //         },
    //           pipeline: [
    //             { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $lt: [ "$_id", "$$cursorId"]},
    //                     { $eq: [ "$user", "$$userId" ] },
    //                     { $eq: [ "$onModel", "$$onModel" ] }
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'followed'
    //         }
    //       },
    //       { $unwind: "$followed" },
    //       { $replaceRoot: { "newRoot": "$followed" } },
    //       { $sort: { "createdAt": -1 } },
    //       { $limit: 100 }
    //     ]).then(res => {
    //       return res
    //     })
    //   }
    // },
    // fetchRecommendedTags: {
    //   type: GraphQLList(TagType),
    //   args: {
    //     query: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query }) {
    //     return User.findOne({ blogName: query })
    //       .then(user => {
    //         return Tag.find({
    //           '_id': { $nin: user.tagFollows },
    //           function(err) {
    //             console.log(err)
    //           }
    //         })
    //           .sort('followerCount')
    //           .limit(8)
    //       })
    //   }
    // },
    // fetchDiscoverFeed: {
    //   type: GraphQLList(PleaOrVariantType),
    //   args: { query: { type: GraphQLString } },
    //   resolve(parentValue, { query }) {
    //     return User
    //     .aggregate([
    //       { $match: { blogName: query } },
    //       {
    //         $lookup: {
    //           from: 'likes',
    //           localField: '_id',
    //           foreignField: 'user',
    //           as: 'likes'
    //         }
    //       },
    //       { $unwind: '$likes' },
    //       { $replaceRoot: { "newRoot": '$likes' } }
    //     ]).then(likes => {
    //       var likedPostIds = likes.map(l => l.post._id)

    //       return User.findOne({ blogName: query })
    //         .then(user => {
    //           var filteredTagRegex = handleFilterTagRegex(user)
    
    //           var filteredPostContentRegex = handleFilterPostContentRegex(user)
    
    //           return Post.aggregate([
    //             {
    //               $lookup: {
    //                 from: 'posts',
    //                 let: {
    //                   userId: user._id,
    //                   likedPostIds: likedPostIds,
    //                   filteredTagRegex: filteredTagRegex,
    //                   filteredPostContentRegex: filteredPostContentRegex
    //                 },
    //                 pipeline: [
    //                   {
    //                     $match: {
    //                       $expr: {
    //                         $and:
    //                         [
    //                           { $not: { $eq: ["$user", "$$userId" ] } },
    //                           { $not: { $in: ["$_id", "$$likedPostIds" ] } },
    //                           { $not: [
    //                               {
    //                                 $regexMatch: {
    //                                   input: "$tagTitles",
    //                                   regex: "$$filteredTagRegex"
    //                                 }
    //                               }
    //                             ]
    //                           },
    //                         { $not: [
    //                               {
    //                                 $regexMatch: {
    //                                   input: "$allText",
    //                                   regex: "$$filteredPostContentRegex"
    //                                 }
    //                               }
    //                             ]
    //                           }
    //                         ]
    //                       }
    //                     }
    //                   }
    //                 ],
    //                 as: 'posts'
    //               }
    //             },
    //             { $group: {
    //                 _id: '$posts'
    //               }
    //             },
    //             { $unwind: '$_id' },
    //             { $replaceRoot: { "newRoot": "$_id" } },
    //             { $sort: { "notesHeatLastTwoDays": 1, "notesCount": 1 } },
    //             { $limit: 30 }
    //           ]).then(posts => {
    //             return posts
    //           })
    //         })
    //     })
    //   }
    // },
    // fetchPostRadar: {
    //   type: PleaOrVariantType,
    //   args: {
    //     query: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query }) {
    //     return User.findOne({ blogName: query })
    //       .then(user => {
    //         var filteredTagRegex = handleFilterTagRegex(user)

    //         var filteredPostContentRegex = handleFilterPostContentRegex(user)

    //         return User.aggregate([
    //           {
    //             $lookup: {
    //               from: 'follows',
    //               let: {
    //                 userId: mongoose.Types.ObjectId(user._id),
    //                 onModel: 'User',
    //               },
    //               pipeline: [
    //                 { $match: {
    //                     $expr: {
    //                       $and:
    //                       [
    //                         { $eq: ["$user", "$$userId"] },
    //                         { $eq: ["$onModel", "$$onModel"] },
    //                       ]
    //                     }
    //                   }
    //                 }
    //               ],
    //               as: 'follows'
    //             }
    //           },
    //           { $unwind: "$follows" },
    //           { $replaceRoot: { "newRoot": "$follows" } },
    //           {
    //             $project: {
    //               follows: 1
    //             }
    //           }
    //         ]).then(follows => {
    //           var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))

    //           return Post.aggregate([
    //             {
    //               $lookup: {
    //                 from: 'posts',
    //                 let: {
    //                   userId: mongoose.Types.ObjectId(user._id),
    //                   followIds: followIds,
    //                   filteredTagRegex: filteredTagRegex,
    //                   filteredPostContentRegex: filteredPostContentRegex
    //                 },
    //                 pipeline: [
    //                   {
    //                     $match: {
    //                       $expr: {
    //                         $and:
    //                         [
    //                           { $not: { $eq: ["$user", "$$userId" ] } },
    //                           { $not: { $in: ["$user", "$$followIds" ] } },
    //                           { $not: [
    //                               {
    //                                 $regexMatch: {
    //                                   input: "$tagTitles",
    //                                   regex: "$$filteredTagRegex"
    //                                 }
    //                               }
    //                             ]
    //                           },
    //                         { $not: [
    //                               {
    //                                 $regexMatch: {
    //                                   input: "$allText",
    //                                   regex: "$$filteredPostContentRegex"
    //                                 }
    //                               }
    //                             ]
    //                           }
    //                         ]
    //                       }
    //                     }
    //                   }
    //                 ],
    //                 as: 'posts'
    //               }
    //             },
    //             { $group: {
    //                 _id: '$posts'
    //               }
    //             },
    //             { $unwind: '$_id' },
    //             { $replaceRoot: { "newRoot": "$_id" } },
    //             { $sort: { "notesHeatLastTwoDays": 1, "notesCount": 1 } },
    //             { $limit: 10 }
    //           ]).then(posts => {
    //             var post = posts[Math.floor(Math.random() * posts.length)]
    //             return post
    //           })
    //         })
    //       })
    //   }
    // },
    // fetchCheckOutTheseBlogs: {
    //   type: GraphQLList(UserType),
    //   args: {
    //     query: { type: GraphQLString }
    //   },
    //   resolve(parentValue, { query }) {
        
    //     return User.aggregate([
    //       { $match: { blogName: query } },
    //       {
    //         $lookup: {
    //           from: 'follows',
    //           let: {
    //             userId: '$_id',
    //             onModel: 'User',
    //           },
    //           pipeline: [
    //             { $match: {
    //                 $expr: {
    //                   $and:
    //                   [
    //                     { $eq: ["$user", "$$userId"] },
    //                     { $eq: ["$onModel", "$$onModel"] },
    //                   ]
    //                 }
    //               }
    //             }
    //           ],
    //           as: 'follows'
    //         }
    //       },
    //       { $unwind: "$follows" },
    //       { $replaceRoot: { "newRoot": "$follows" } },
    //       {
    //         $project: {
    //           follows: 1
    //         }
    //       }
    //     ]).then(follows => {
    //       var followIds = follows.map(f => mongoose.Types.ObjectId(f.follows))
          
    //       return User.find({
    //         '_id': { $nin: followIds },
    //         'blogName': { $ne: query }
    //       })
    //       .sort([
    //         ['postingHeatLastMonth', -1], 
    //         ['followerCount', -1]
    //       ])
    //       .limit(4)
    //       .then(users => {
    //         return users
    //       })
    //     })
    //   }
    // },
    user: {
      type: UserType,
      args: { userId: { type: GraphQLString } },
      resolve(parentValue, { userId }) {
        return User.findById( userId );
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    plea: {
      type: PleaType,
      args: {
        pleaId: { type: GraphQLID }
      },
      resolve(parentValue, { pleaId }) {
        return Plea.findById(pleaId);
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
      args: { tagId: { type: GraphQLID } },
      resolve(_, { tagId }) {
        return Tag.findById(tagId);
      }
    },
    sympathy: {
      type: SympathyType,
      args: { _id: { type: GraphQLID } },
      resolve(_, {_id}) {
        return Sympathy.findById(_id)
      }
    },
  })
})

export default RootQueryType;