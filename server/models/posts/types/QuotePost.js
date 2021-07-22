import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const QuotePost = Post.discriminator('QuotePost',
  new Schema({
    quote: {
      type: String
    },
    source: {
      type: String
    }
  }))

export default QuotePost;