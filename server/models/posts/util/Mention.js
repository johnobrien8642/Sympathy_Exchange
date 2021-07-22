import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MentionSchema = new Schema({
  mention: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  post: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
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
    ]
  },
  // followerCount: {
  //   type: Number
  // },
  // heat: {
  //   type: Number
  // },
  kind: {
    type: String,
    default: 'Mention'
  }
})

const Mention = mongoose.model('Mention', MentionSchema, 'mentions');

export default Mention;