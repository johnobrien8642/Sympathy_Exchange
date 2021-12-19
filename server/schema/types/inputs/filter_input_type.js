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
    byTagIds: { type: GraphQLBoolean },
    bySympathizedPleaIds: { type: GraphQLList(GraphQLString) },
    bySavedPleaIds: { type: GraphQLList(GraphQLString) },
    byUserFollows: { type: GraphQLList(GraphQLString) },
    byTagFollows: { type: GraphQLList(GraphQLString) },
    feedSort: { type: GraphQLString }
  })
});

export default FilterInputType;