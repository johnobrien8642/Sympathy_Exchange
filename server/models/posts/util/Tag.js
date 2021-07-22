import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  followerCount: {
    type: Number,
    default: 0
  },
  followerHeatLastWeek: {
    type: Number,
    default: 0
  },
  postHeatLastWeek: {
    type: Number,
    default: 0
  },
  kind: {
    type: String,
    default: 'Tag'
  }
})

const Tag = mongoose.model('Tag', TagSchema, 'tags');

export default Tag;