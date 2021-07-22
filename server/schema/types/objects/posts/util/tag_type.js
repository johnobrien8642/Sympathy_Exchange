import mongoose from 'mongoose';
import graphql, { GraphQLInt } from 'graphql';
import UserType from '../../user_type.js';
const Tag = mongoose.model('Tag');
const { GraphQLObjectType, 
        GraphQLString, GraphQLID } = graphql;

const TagType = new GraphQLObjectType({
  name: 'TagType',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    kind: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
          .populate('user')
          .then(tag => tag.user)
      }
    },
    followerCount: { type: GraphQLInt },
    followerHeatLastWeek: { type: GraphQLInt },
    postHeatLastWeek: { type: GraphQLInt }
  })
})

export default TagType;