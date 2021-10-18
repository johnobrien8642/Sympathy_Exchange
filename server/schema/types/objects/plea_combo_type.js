import graphql from 'graphql';
import mongoose from 'mongoose';
import UserType from './user_type.js';
import PleaComboLLNodeType from './plea_combo_ll_node_type.js';
import PleaCombo from '../../../models/Plea_Combo.js';

const { GraphQLObjectType, GraphQLID,
				GraphQLList, GraphQLInt } = graphql;

const PleaComboType = new GraphQLObjectType({
	name: 'PleaComboType',
	fields: () => ({
		_id: { type: GraphQLID },
		userId: { 
			type: UserType,
			async resolve(parentValue) {
				return await
					PleaCombo
						.findById(parentValue._id)
						.populate('userId')
						.then(res => res.userId);
			} 
		},
		pleaLL: {
			type: GraphQLList(PleaComboLLNodeType),
			async resolve(parentValue) {
				return await 
					PleaCombo
					.findById(parentValue._id)
					.populate('pleaLL')
					.then(res => res.pleaLL);
			}
		},
		number: { type: GraphQLInt }
	})
})

export default PleaComboType;