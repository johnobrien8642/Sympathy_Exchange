import mongoose from 'mongoose';
import graphql from 'graphql';
import lodash from 'lodash';
import UserType from './user_type.js';
import TagType from './tag_type.js';
const { indexOf } = lodash;

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
          .then(plea => plea.pleaIdChain)
      }
    },
    sympathyCount: { 
      type: GraphQLFloat,
      async resolve(parentValue) {
        return Plea
          .findById(parentValue._id)
          .then(async (plea) => {
            const pleaIds = 
              await Plea
                .find({ sympathyCount: { $gt: 0 } })
                .sort({ sympathyCount: 1, createdAt: 1 })
                .distinct("_id");
            
            const pleaIdStrings =
              pleaIds.map(String);
            
            const index = indexOf(pleaIdStrings, plea._id.toString(), true);

            let decimal = index / plea.sympathyCount;
            let roundToFour = decimal.toFixed(4);

            return plea.sympathyCount + roundToFour.slice(1);
          })
      }
    },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
});

export default PleaType;