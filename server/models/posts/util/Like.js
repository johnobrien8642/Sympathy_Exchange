import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  postAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [ 
      'TextPost', 
      'PhotoPost', 
      'QuotePost', 
      'LinkPost', 
      'ChatPost', 
      'AudioPost', 
      'VideoPost', 
      'Repost'
    ]
  },
  kind: {
    type: String,
    default: 'Like'
  },
})

const Like = mongoose.model('Like', LikeSchema, 'likes')

export default Like;