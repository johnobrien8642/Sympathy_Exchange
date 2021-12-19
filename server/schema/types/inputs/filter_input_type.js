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
    bySympathizedPleaIds: { type: GraphQLBoolean },
    bySavedPleaIds: { type: GraphQLBoolean },
    byUserFollows: { type: GraphQLBoolean },
    byTagFollows: { type: GraphQLBoolean },
    bySympathizedPleaIdsArr: { type: GraphQLList(GraphQLString) },
    bySavedPleaIdsArr: { type: GraphQLList(GraphQLString) },
    byUserFollowsArr: { type: GraphQLList(GraphQLString) },
    byTagFollowsArr: { type: GraphQLList(GraphQLString) },
    feedSort: { type: GraphQLString }
  })
});

export default FilterInputType;