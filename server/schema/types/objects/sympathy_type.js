import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from './user_type.js';
import PleaType from './plea_type.js';
const Sympathy = mongoose.model('Sympathy');
const { GraphQLID, 
        GraphQLObjectType, 
        GraphQLString, 
        GraphQLBoolean } = graphql;

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
    plea: {
      type: PleaType,
      resolve(parentValue) {
        return Sympathy.findById(parentValue._id)
          .populate('plea')
          .then(sympathy => sympathy.plea);
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
    unsympathy: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default SympathyType;
