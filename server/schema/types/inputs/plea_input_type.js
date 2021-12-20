import graphql from 'graphql';
const { GraphQLBoolean, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLInputObjectType } = graphql;

const PleaInputType = new GraphQLInputObjectType({
  name: 'PleaInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    authorId: { type: GraphQLID },
    authorUsername: { type: GraphQLID },
    text: { type: GraphQLString },
    pleaIdChain: { type: GraphQLList(GraphQLID) },
    tagIds: { type: GraphQLList(GraphQLID) },
    chaining: { type: GraphQLBoolean },
    combinedCount: { type: GraphQLInt }
  })
})

export default PleaInputType;