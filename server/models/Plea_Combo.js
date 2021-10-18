import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PleaComboSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	pleaLL: [
		{
			type: Schema.Types.ObjectId,
			ref: 'PleaComboLLNode'
		}
	],
	number: {
		type: Schema.Types.Number
	}
});

const PleaCombo = mongoose.model('PleaCombo', PleaComboSchema);

export default PleaCombo;
