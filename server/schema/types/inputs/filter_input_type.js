import graphql from 'graphql';
const { GraphQLInt,
        GraphQLList,
        GraphQLString,
        GraphQLID,
        GraphQLBoolean,
        GraphQLInputObjectType } = graphql;

const FilterInputType = new GraphQLInputObjectType({
  name: 'FilterInputType',
  fields: () => ({
    floor: { type: GraphQLInt },
    ceiling: { type: GraphQLInt },
    rangeArr: { type: GraphQLList(GraphQLInt) },
    tagIdArr: { type: GraphQLList(GraphQLID) },
    bySympCount: { type: GraphQLBoolean },
    byTagIds: { type: GraphQLBoolean }
  })
});

export default FilterInputType;