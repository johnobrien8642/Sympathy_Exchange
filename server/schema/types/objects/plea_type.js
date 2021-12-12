import mongoose from 'mongoose';
import graphql from 'graphql';
import lodash from 'lodash';
import UserType from './user_type.js';
import TagType from './tag_type.js';

const Plea = mongoose.model('Plea');
const { GraphQLString, 
        GraphQLID, 
        GraphQLInt,
        GraphQLFloat,
        GraphQLList, 
        GraphQLBoolean, 
        GraphQLObjectType } = graphql;

const PleaType = new GraphQLObjectType({
  name: 'PleaType',
  fields: () => ({
    _id: { type: GraphQLID },
    text: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parentValue) {
        return Plea.findById(parentValue._id)
          .populate('author')
          .then(plea => plea.author)
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
        return Plea.findById(parentValue._id)
          .populate('pleaIdChain')
          .then(plea => plea.pleaIdChain);
      }
    },
    chainedByThesePleas: {
      type: GraphQLList(PleaType),
      resolve(parentValue) {
        return Plea.findById(parentValue._id)
          .populate('chainedByThesePleas')
          .then(plea => plea.chainedByThesePleas);
      }
    },
    sympathyCount: { 
      type: GraphQLFloat,
      async resolve(parentValue) {
        return await Plea.findById(parentValue._id)
          .then(plea => parseFloat(plea.sympathyCount.toString()));
      }
    },
    combinedSympathyCount: { 
      type: GraphQLFloat,
      async resolve(parentValue) {
        return await Plea.findById(parentValue._id)
          .populate('pleaIdChain')
          .then(plea => plea.pleaIdChain.reduce((prev, next) => { return prev += next.sympathyCount }, 0));
      }
    },
    // sympathyCount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
});

export default PleaType;