import mongoose from 'mongoose';
import graphql, { GraphQLList } from 'graphql';
import UserType from './user_type.js';
import TagType from './tag_type.js';

const Plea = mongoose.model('Plea');
const { GraphQLString, GraphQLID, GraphQLBoolean, GraphQLObjectType } = graphql;

const PleaType = new GraphQLObjectType({
  name: 'PleaType',
  fields: () => ({
    _id: { type: GraphQLID },
    text: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parentValue) {
        return Plea.findById(parentValue._id)
          .populate('user')
          .then(plea => plea.user)
      }
    },
    tagIds: {
      type: GraphQLList(TagType),
      resolve(parentValue) {
        return Plea.findById(parentValue._id)
          .populate('tagIds')
          .then(plea => plea.tagIds)
      }
    },
    chained: { type: GraphQLBoolean },
    pleaIdChain: {
      type: GraphQLList(PleaType),
      resolve(parentValue) {
        return Plea
      }
    }, 
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default PleaType;