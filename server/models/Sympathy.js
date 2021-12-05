import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SympathySchema = new Schema({
  plea: {
    type: Schema.Types.ObjectId,
    ref: 'Plea'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  unsympathy: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Sympathy'
  }
});

const Sympathy = mongoose.model('Sympathy', SympathySchema, 'sympathies');

export default Sympathy;