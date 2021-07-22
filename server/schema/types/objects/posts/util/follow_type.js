import mongoose from 'mongoose';
import UserType from '../../user_type.js';
import UserAndTagType from '../../../unions/user_and_tag_type.js';
const Follow = mongoose.model('Follow');
import graphql, { GraphQLInt } from 'graphql';
const { GraphQLObjectType,
        GraphQLString, GraphQLID } = graphql

const FollowType = new GraphQLObjectType({
  name: 'FollowType',
  fields: () => ({
    _id: { type: GraphQLID },
    kind: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Follow.findById(parentValue._id)
        .populate('user')
        .then(repost => repost.user)
      }
    },
    follows: {
      type: UserAndTagType,
      resolve(parentValue) {
        return Follow.findById(parentValue._id)
        .populate('follows')
        .then(repost => repost.follows)
      }
    },
    createdAt: { type: GraphQLString }
  })
})

export default FollowType;