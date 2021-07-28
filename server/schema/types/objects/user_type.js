import graphql from 'graphql';
import mongoose from 'mongoose';
import PleaType from '../objects/plea_type.js'
import TagType from '../objects/tag_type.js'
import SympathyType from '../objects/sympathy_type.js'
import FollowType from './follow_type.js'
const User = mongoose.model('User');
const { GraphQLObjectType, GraphQLString,
        GraphQLList, GraphQLInt,
        GraphQLBoolean, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    loggedIn: { type: GraphQLBoolean },
    secretRecoveryPhrase: { type: GraphQLString },
    timedSecretRecoveryPhraseAccessToken: { type: GraphQLString },
    createdAt: { type: GraphQLInt },
    lastUpdated: { type: GraphQLInt },
    kind: { type: GraphQLString },
    // savedPleas: {
    //   type: GraphQLList(PleaType),
    //   resolve(parentValue) {
    //     return User.findById(parentValue._id)
    //       .populate('savedPleasAndVariants')
    //       .then(user => user.savedPleasAndVariants)
    //   }
    // },
    tagFollows: {
      type: GraphQLList(TagType),
      resolve(parentValue) {
        return User.findById(parentValue._id)
          .populate('tagFollows')
          .then(user => user.tagFollows)
      }
    }
  })
})

export default UserType;