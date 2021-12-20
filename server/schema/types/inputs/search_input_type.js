import graphql from 'graphql';
import FilterInputType from './filter_input_type.js';
const { GraphQLBoolean, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql;

const SearchInputType = new GraphQLInputObjectType({
  name: 'SearchInputType',
  fields: () => ({
    input: { type: GraphQLString },
    userId: { type: GraphQLID },
    tagId: { type: GraphQLID },
    filter: { type: FilterInputType }
  })
});

export default SearchInputType;