import graphql from 'graphql';
import FilterInputType from './filter_input_type.js';
const { GraphQLBoolean, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql;

const FetchFeedInputType = new GraphQLInputObjectType({
  name: 'FetchFeedInputType',
  fields: () => ({
    filter: { type: FilterInputType },
    cursor: { type: GraphQLInt },
    altCursor: { type: GraphQLString },
    tagId: { type: GraphQLID },
    userId: { type: GraphQLID }
  })
})

export default FetchFeedInputType;