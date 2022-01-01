import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SaveSchema = new Schema({
  plea: {
    type: Schema.Types.ObjectId,
    ref: 'Plea'
  },
  pleaAuthorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Save'
  }
});

const Save = mongoose.model('Save', SaveSchema, 'saves');

export default Save;