import graphql from 'graphql';
import TagInputType from '../inputs/tag_input_type.js';
const { GraphQLBoolean, GraphQLString, GraphQLID, GraphQLList, GraphQLInputObjectType } = graphql;

const PleaInputType = new GraphQLInputObjectType({
  name: 'PleaInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    author: { type: GraphQLID },
    text: { type: GraphQLString },
    pleaIdChain: { type: GraphQLList(GraphQLID) },
    tagIds: { type: GraphQLList(GraphQLID) },
    chaining: { type: GraphQLBoolean }
  })
})

export default PleaInputType;