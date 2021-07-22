import graphql from 'graphql';
const { GraphQLID, GraphQLObjectType, 
        GraphQLString, GraphQLFloat } = graphql;

const AudioType = new GraphQLObjectType({
  name: 'AudioType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    key: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default AudioType;