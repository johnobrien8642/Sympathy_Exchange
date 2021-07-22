import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  follows: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [ 'Tag', 'User' ]
  },
  kind: {
    type: String,
    default: 'Follow'
  },
})

const Follow = mongoose.model('Follow', FollowSchema, 'follows')
export default Follow;
