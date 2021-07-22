import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post');

const VideoPost = Post.discriminator('VideoPost',
  new Schema({
  videoLink: {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    },
  }))

export default VideoPost;