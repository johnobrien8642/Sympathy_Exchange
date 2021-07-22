import graphql from 'graphql';
import mongoose from 'mongoose';
import ImageType from '../util/image_type.js';
import TagType from '../util/tag_type.js';
import MentionType from '../util/mention_type.js';
import UserType from '../../user_type.js';
import AudioType from '../util/audio_type.js';
import { GraphQLJSONObject } from 'graphql-type-json';
const Post = mongoose.model('Post');
const { GraphQLList, GraphQLID, 
        GraphQLString, GraphQLObjectType } = graphql;

const AudioPostType = new GraphQLObjectType({
  name: 'AudioPostType',
  fields: () => ({
    _id: { type: GraphQLID },
    audioFile: {
      type: AudioType,
      resolve(parentValue) {
        return Post.findById(parentValue._id)
          .populate('audioFile')
          .then(post => post.audioFile)
      }
    },
    audioMeta: { type: GraphQLJSONObject },
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

export default AudioPostType;