import mongoose from 'mongoose';
import graphql, { GraphQLInt } from 'graphql';
import UserType from './user_type.js';
const Tag = mongoose.model('Tag');
const { GraphQLObjectType, 
        GraphQLString, GraphQLID } = graphql;

const TagType = new GraphQLObjectType({
  name: 'TagType',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    postCount: {
      type: GraphQLInt,
      resolve(parentValue) {
        return Tag.aggregate([
          {
            $lookup: {
              from: 'pleas',
              let: { tagId: parentValue._id },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $in: ["$$tagId", "$tagIds"] }
                      ]
                    }
                  }
                }
              ],
              as: "pleas"
            }
          },
          {
            $project: {
              pleaCount: { $size: "$pleas" }
            }
          }
        ])
        .then(res => res[0].pleaCount)
      }
    },
    user: {
      type: UserType,
      resolve(parentValue) {
        return Tag.findById(parentValue._id)
        .populate('user')
        .then(tag => tag.user)
      }
    },
    kind: { type: GraphQLString },
  })
})

export default TagType;