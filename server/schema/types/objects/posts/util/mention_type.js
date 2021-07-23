import graphql, { GraphQLInt } from 'graphql';
import mongoose from 'mongoose';
import PhotoPostType from '../types/photo_post_type.js';
import PleaOrVariantType from '../../../unions/plea_or_variant_type.js'
import UserType from '../../user_type.js';
const Mention = mongoose.model('Mention');
const { GraphQLObjectType, GraphQLList,
        GraphQLString, GraphQLID, GraphQLFloat } = graphql;

const MentionType = new GraphQLObjectType({
  name: 'MentionType',
  fields: () => ({
    _id: { type: GraphQLID },
    mention: {
      type: UserType,
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('mention')
        .then(tag => tag.mention)
      }
    },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('user')
        .then(tag => tag.user)
      }
    },
    post: {
      type: PleaOrVariantType,
      resolve(parentValue) {
        return Mention.findById(parentValue._id)
        .populate('post')
        .then(mention => mention.post)
      }
    },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString },
  })
})

export default MentionType;