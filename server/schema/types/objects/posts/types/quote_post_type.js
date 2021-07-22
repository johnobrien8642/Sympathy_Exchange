import graphql from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose from 'mongoose';
import UserType from '../../user_type.js';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
import MentionType from '../util/mention_type.js';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const QuotePostType = new GraphQLObjectType({
  name: 'QuotePostType',
  fields: () => ({
    _id: { type: GraphQLID },
    quote: { type: GraphQLString },
    source: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('user')
          .then(post => post.user)
      }
    },
    allText: { type: GraphQLString },
    descriptions: { type: GraphQLList(GraphQLJSONObject) },
    descriptionImages: {
      type: new GraphQLList(ImageType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('descriptionImages')
          .then(post => post.descriptionImages)
      }
    },
    tagIds: {
      type: new GraphQLList(TagType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('tagIds')
          .then(post => post.tagIds)
      }
    },
    tagTitles: { type: GraphQLString },
    mentions: {
      type: new GraphQLList(MentionType),
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('mentions')
          .then(post => post.mentions)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    kind: { type: GraphQLString },
  })
})

export default QuotePostType;