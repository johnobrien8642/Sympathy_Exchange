import mongoose from 'mongoose';
import graphql from 'graphql';
import UserType from './user_type.js';

const Plea = mongoose.model('Plea');
const { GraphQLObjectType } = graphql;

const PleaType = new GraphQLObjectType({
  name: 'PleaType',
  fields: () => ({
    author: {
      type: UserType,
      resolve(parentValue) {
        return Plea.findById(parentValue._id)
          .populate('user')
          .then(plea => plea.user)
      }
    }
  })
})

export default PleaType;