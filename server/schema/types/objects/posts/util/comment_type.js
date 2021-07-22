import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from '../../user_type.js';
import AnyPostType from '../../../unions/any_post_type.js';
const Comment = mongoose.model('Comment')
const { GraphQLID, GraphQLString,
        GraphQLObjectType } = graphql;

const CommentType = new GraphQLObjectType({
  name: 'CommentType',
  fields: () => ({
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
        .populate('user')
        .then(repost => repost.user)
      }
    },
    post: {
      type: AnyPostType,
      resolve(parentValue) {
        return Comment.findById(parentValue._id)
        .populate('post')
        .then(repost => repost.post)
      }
    },
    createdAt: { type: GraphQLString },
    onModel: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default CommentType;