import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from './user_type.js';
import PleaType from './plea_type.js';
const Save = mongoose.model('Save');
const { GraphQLID, 
        GraphQLObjectType, 
        GraphQLString, 
        GraphQLBoolean } = graphql;

const SaveType = new GraphQLObjectType({
  name: 'SaveType',
  fields: () => ({
    _id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Save.findById(parentValue._id)
          .populate('user')
          .then(save => save.user);
      }
    },
    plea: {
      type: PleaType,
      resolve(parentValue) {
        return Save.findById(parentValue._id)
          .populate('plea')
          .then(sympathy => sympathy.plea);
      }
    },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default SaveType;
