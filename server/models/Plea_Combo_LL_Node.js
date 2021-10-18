import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PleaComboLLNodeSchema = new Schema({
    headOrTail: {
      type: Schema.Types.Boolean,
      default: false
    },
    pleaComboId: {
      type: Schema.Types.ObjectId,
			ref: 'PleaCombo'
    },
    pleaId: {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    },
    nextPleaId: {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    },
    previousPleaId: {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    },
});

const PleaComboLLNode = mongoose.model('PleaComboLLNode', PleaComboLLNodeSchema, 'pleaComboLLNodes' );

export default PleaComboLLNode;
