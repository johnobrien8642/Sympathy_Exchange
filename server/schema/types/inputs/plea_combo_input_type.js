import graphql from 'graphql';
import PleaComboLLNodeInputType from './plea_combo_ll_node_input_type.js';
const { GraphQLList, GraphQLInputObjectType, GraphQLID } = graphql;

const PleaComboInputType = new GraphQLInputObjectType({
  name: 'PleaComboInputType',
  fields: () => ({
    _id: { type: GraphQLID },
    pleaLL: { type: GraphQLList(PleaComboLLNodeInputType) }
  })
})

export default PleaComboInputType;