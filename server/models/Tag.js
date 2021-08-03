import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  postCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Tag'
  }
});

const Tag = mongoose.model('Tag', TagSchema, 'tags');

export default Tag;