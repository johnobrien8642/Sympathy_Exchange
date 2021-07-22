import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post');

const TextPost = Post.discriminator('TextPost',
  new Schema({
    title: {
      type: String,
      default: ''
    },
  }))

export default TextPost;