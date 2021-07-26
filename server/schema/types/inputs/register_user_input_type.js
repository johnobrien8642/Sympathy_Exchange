import graphql from 'graphql';
const { GraphQLString, 
        GraphQLID, GraphQLInputObjectType } = graphql;

const RegisterUserInputType = new GraphQLInputObjectType({ 
  name: 'RegisterUserInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    secretRecoveryPhrase: { type: GraphQLString }
  })
})

export default RegisterUserInputType;