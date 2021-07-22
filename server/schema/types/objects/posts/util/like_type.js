import mongoose from 'mongoose';
import graphql from 'graphql';
import AnyPostType from '../../../unions/any_post_type.js';
import UserType from '../../user_type.js';
const Like = mongoose.model('Like');
const { GraphQLID, GraphQLObjectType, 
        GraphQLString } = graphql;

const LikeType = new GraphQLObjectType({
  name: 'LikeType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Like.findById(parentValue._id)
          .populate('user')
          .then(like => like.user)
      }
    },
    post: {
      type: AnyPostType,
      resolve(parentValue) {
        return Like.findById(parentValue._id)
          .populate('post')
          .then(like => like.post)
      }
    },
    postAuthor: {
      type: UserType,
      resolve(parentValue) {
        return Like.findById(parentValue._id)
          .populate('postAuthor')
          .then(like => like.postAuthor)
      }
    },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default LikeType;
