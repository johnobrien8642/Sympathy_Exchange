import graphql from 'graphql';
import mongoose from 'mongoose';
import PleaComboLLNode from '../../../models/Plea_Combo_LL_Node.js';
import PleaType from '../objects/plea_type.js';
const { GraphQLObjectType, GraphQLID,
        GraphQLBoolean, GraphQLList, 
				GraphQLInt } = graphql;

const PleaComboLLNodeType = new GraphQLObjectType({
		name: 'PleaComboLLNodeType',
    fields: () => ({
    	_id: { type: GraphQLID },
			headOrTail: { type: GraphQLBoolean },
    	pleaComboId: {
				type: PleaType,
				async resolve(parentValue) {
					return await
						PleaComboLLNode
							.findById(parentValue._id)
							.populate('pleaComboId')
							.then(res => res.pleaComboId);
				}
			},
			pleaId: {
				type: PleaType,
				async resolve(parentValue) {
					return await 
						PleaComboLLNode
							.findById(parentValue._id)
							.populate('pleaId')
							.then(res => res.pleaId);
				}
			},
			nextPleaId: {
				type: PleaType,
				async resolve(parentValue) {
					return await 
						PleaComboLLNode
							.findById(parentValue._id)
							.populate('nextPleaId')
							.then(res => res.nextPleaId);
				}
			},
			previousPleaId: {
				type: PleaType,
				async resolve(parentValue) {
					return await 
						PleaComboLLNode
							.findById(parentValue._id)
							.populate('previousPleaId')
							.then(res => res.previousPleaId);
				}
			},
    })
})

export default PleaComboLLNodeType;