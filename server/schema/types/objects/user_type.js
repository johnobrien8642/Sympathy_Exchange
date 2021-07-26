import graphql from 'graphql';
import mongoose from 'mongoose';
import PleaOrVariantType from '../unions/plea_or_variant_type.js'
import TagType from '../objects/posts/util/tag_type.js'
import LikeType from '../objects/posts/util/like_type.js'
import RepostType from '../objects/posts/util/repost_type.js'
import FollowType from '../objects/posts/util/follow_type.js'
import ImageType from './posts/util/image_type.js';
import PleaType from './posts/types/plea_type.js';
import VariantType from './posts/types/variant_type.js';
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