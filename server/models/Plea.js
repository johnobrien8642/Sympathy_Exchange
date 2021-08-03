import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' }

const PleaSchema = new Schema({
  text: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  tagIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Post'
  }
}, options)
  
const Plea = mongoose.model('Plea', PleaSchema, 'posts')

export default Plea;