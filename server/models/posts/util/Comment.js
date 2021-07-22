import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  postAuthorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  onModel: {
    type: String,
    required: true,
    enum: [
      'Repost',
      'TextPost', 
      'PhotoPost', 
      'QuotePost', 
      'LinkPost', 
      'ChatPost', 
      'AudioPost', 
      'VideoPost',
    ]
  },
  kind: {
    type: String,
    default: 'Comment'
  },
})

const Comment = mongoose.model('Comment', CommentSchema, 'comments');

export default Comment;