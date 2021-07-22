import graphql from 'graphql';
const { GraphQLID, 
        GraphQLObjectType, GraphQLString } = graphql;

const VideoType = new GraphQLObjectType({
  name: 'VideoType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    key: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    kind: { type: GraphQLString }
  })
})

export default VideoType;