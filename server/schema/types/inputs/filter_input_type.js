import graphql from 'graphql';
const { GraphQLInt,
        GraphQLList,
        GraphQLID,
        GraphQLBoolean,
        GraphQLInputObjectType } = graphql;

const FilterInputType = new GraphQLInputObjectType({
  name: 'FilterInputType',
  fields: () => ({
    floor: { type: GraphQLInt },
    ceiling: { type: GraphQLInt },
    tagIdArr: { type: GraphQLList(GraphQLID) },
    bySympCount: { type: GraphQLBoolean },
    byTagIds: { type: GraphQLBoolean }
  })
});

export default FilterInputType;