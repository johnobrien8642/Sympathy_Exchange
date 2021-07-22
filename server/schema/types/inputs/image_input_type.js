import graphql from 'graphql';
const { GraphQLString, 
        GraphQLID, GraphQLInputObjectType } = graphql;

const ImageInputType = new GraphQLInputObjectType({ 
  name: 'ImageInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    url: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  })
})

export default ImageInputType;
