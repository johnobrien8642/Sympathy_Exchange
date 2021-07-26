import graphql from 'graphql';

const { GraphQLObjectType } = graphql;

const VariantType = new GraphQLObjectType({
  name: 'VariantType',
  fields: () => ({
  })
})

export default VariantType;