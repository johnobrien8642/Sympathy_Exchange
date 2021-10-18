import graphql from 'graphql';
import PleaComboType from '../objects/plea_combo_type.js';
const { GraphQLID, GraphQLInputObjectType, GraphQLBoolean } = graphql;

const PleaComboLLNodeInputType = new GraphQLInputObjectType({
  name: 'PleaComboLLNodeInputType',
  fields: () => ({
    headOrTail: { type: GraphQLBoolean },
    pleaComboId: { type: GraphQLID },
    pleaId: { type: GraphQLID },
    nextPleaId: { type: GraphQLID },
    previousPleaId: { type: GraphQLID },
  })
})

export default PleaComboLLNodeInputType;