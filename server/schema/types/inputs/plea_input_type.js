import graphql from 'graphql';
import TagInputType from '../inputs/tag_input_type.js';
const { GraphQLString, GraphQLID, GraphQLList, GraphQLInputObjectType } = graphql;

const PleaInputType = new GraphQLInputObjectType({
  name: 'PleaInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    author: { type: GraphQLID },
    text: { type: GraphQLString },
    tags: { type: GraphQLList(TagInputType) }
  })
})

export default PleaInputType;