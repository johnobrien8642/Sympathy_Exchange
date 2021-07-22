import mongoose from 'mongoose';
import graphql, { GraphQLList } from 'graphql';
import UserType from '../../user_type.js';
import AnyPostType from '../../../unions/any_post_type.js';
import RepostCaptionType from '../util/repost_caption_type.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const Repost = mongoose.model('Repost');
const { GraphQLID, GraphQLString,
        GraphQLObjectType } = graphql;

const RepostType = new GraphQLObjectType({
  name: 'RepostType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
        .populate('user')
        .then(repost => repost.user)
      }
    },
    post: {
      type: AnyPostType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
        .populate('post')
        .then(repost => repost.post)
      }
    },
    postAuthor: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
        .populate('postAuthor')
        .then(repost => repost.postAuthor)
      }
    },
    repostedFrom: {
      type: UserType,
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
          .populate('repostedFrom')
          .then(repost => repost.repostedFrom)
      }
    },
    repostTrail: { 
      type: GraphQLList(RepostCaptionType),
      resolve(parentValue) {
        return Repost.findById(parentValue._id)
          .populate('repostTrail')
          .then(repost => repost.repostTrail)
      }
    },
    createdAt: { type: GraphQLString },
    onModel: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default RepostType;