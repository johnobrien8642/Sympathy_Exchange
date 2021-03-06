import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' }

const PleaSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  authorUsername: {
    type: String
  },
  tagIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    }
  ],
  chained: {
    type: Boolean,
    default: false
  },
  pleaIdChain: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    },
  ],
  chainedByThesePleas: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Plea'
    }
  ],
  sympathyCount: {
    type: Schema.Types.Decimal128,
    default: 0.0,
    index: true
  },
  combinedSympathyCount: {
    type: Schema.Types.Decimal128,
    default: 0.0,
    index: true
  },
  sympathyCountTicker: {
    type: Number,
    default: 0
  },
  hotStreakTicker: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Plea'
  }
}, options)
  
const Plea = mongoose.model('Plea', PleaSchema, 'pleas')

export default Plea;