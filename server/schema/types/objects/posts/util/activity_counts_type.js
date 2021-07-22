import graphql from 'graphql';
const { GraphQLInt, GraphQLObjectType } = graphql;

const ActivityCountsType = new GraphQLObjectType({
  name: 'ActivityCountsType',
  fields: () => ({
    mentionsCount: { type: GraphQLInt },
    repostsCount: { type: GraphQLInt },
    commentsCount: { type: GraphQLInt },
    likesCount: { type: GraphQLInt },
  })
})

export default ActivityCountsType;