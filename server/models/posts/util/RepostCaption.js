import mongoose from 'mongoose';
const Schema = mongoose.Schema

const RepostCaptionSchema = new Schema({
  caption: { 
    type: String,
    default: null
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  repost: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  kind: {
    type: String,
    default: 'RepostCaption'
  }
})

const RepostCaption = mongoose.model('RepostCaption', RepostCaptionSchema, 'repostCaptions')

export default RepostCaption;