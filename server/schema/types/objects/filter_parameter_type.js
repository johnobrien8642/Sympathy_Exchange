import graphql from 'graphql';
const { GraphQLInt, GraphQLObjectType } = graphql;

const FilterParameterType = new GraphQLObjectType({
  name: 'FilterParameterType',
  fields: () => ({
    integerLength: { type: GraphQLInt },
    ceiling: { type: GraphQLInt },
    ceiling2: { type: GraphQLInt }
  })
});

export default FilterParameterType;