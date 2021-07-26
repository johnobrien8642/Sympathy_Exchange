import graphql from 'graphql';

const { GraphQLObjectType } = graphql;

const PleaType = new GraphQLObjectType({
  name: 'PleaType',
  fields: () => ({
  })
})

export default PleaType;