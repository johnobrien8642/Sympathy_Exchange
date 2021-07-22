import graphql from 'graphql';
import mongoose from 'mongoose';
import RepostType from './repost_type.js';
import UserType from '../../user_type.js'
const RepostCaption = mongoose.model('RepostCaption')
const { GraphQLID, GraphQLString,
        GraphQLObjectType } = graphql;

const RepostCaptionType = new GraphQLObjectType({
  name: 'RepostCaptionType',
  fields: () => ({
    _id: { type: GraphQLID },
    caption: { type: GraphQLString },
    user: { 
      type: UserType,
      resolve(parentValue) {
        return RepostCaption.findById(parentValue._id)
          .populate('user')
          .then(repostCaption => repostCaption.user)
      }
    },
    repost: { 
      type: RepostType,
      resolve(parentValue) {
        return RepostCaption.findById(parentValue._id)
          .populate('repost')
          .then(repostCaption => repostCaption.repost)
      }
    
    }
  })
})

export default RepostCaptionType;