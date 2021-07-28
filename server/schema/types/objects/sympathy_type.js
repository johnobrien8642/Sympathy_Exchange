import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from './user_type.js';
import PleaType from './plea_type.js';
const Sympathy = mongoose.model('Sympathy');
const { GraphQLID, GraphQLObjectType, 
        GraphQLString } = graphql;

const SympathyType = new GraphQLObjectType({
  name: 'SympathyType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Sympathy.findById(parentValue._id)
          .populate('user')
          .then(like => like.user)
      }
    },
    post: {
      type: PleaType,
      resolve(parentValue) {
        return Sympathy.findById(parentValue._id)
          .populate('post')
          .then(like => like.post)
      }
    },
    postAuthor: {
      type: UserType,
      resolve(parentValue) {
        return Sympathy.findById(parentValue._id)
          .populate('postAuthor')
          .then(like => like.postAuthor)
      }
    },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default SympathyType;
