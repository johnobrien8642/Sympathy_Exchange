import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const ChatPost = Post.discriminator('ChatPost', 
  new Schema({
    chat: {
      type: String
    }
  }))

  export default ChatPost;