import graphql from 'graphql';
const { GraphQLString, GraphQLID, GraphQLInt, GraphQLInputObjectType } = graphql;

const TagInputType = new GraphQLInputObjectType({
  name: 'TagInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    postCount: { type: GraphQLInt }
  })
})

export default TagInputType;