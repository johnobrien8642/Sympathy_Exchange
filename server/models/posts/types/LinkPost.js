import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const LinkPost = Post.discriminator('LinkPost', 
  new Schema({
    linkObj: {
      link: String,
      siteName: String,
      imageUrl: String,
      title: String,
      linkDescription: String
    }
  }))

  export default LinkPost;