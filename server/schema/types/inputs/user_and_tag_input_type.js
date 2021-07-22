import graphql from 'graphql';
const { GraphQLString, GraphQLList, 
        GraphQLInputObjectType } = graphql;

const UserAndTagInputType = new GraphQLInputObjectType({
  name: 'UserAndTagInputType',
  fields: () => ({
    OR: { type: GraphQLList(UserAndTagInputType)},
    blogName_contains: { type: GraphQLString },
    tag_title_contains: { type: GraphQLString },
  })
})

export default UserAndTagInputType;
