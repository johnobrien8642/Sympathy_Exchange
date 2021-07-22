import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  kind: {
    type: String,
    default: 'Video'
  }
})

const Video = mongoose.model('Video', VideoSchema, 'video');

export default Video;