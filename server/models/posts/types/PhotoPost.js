import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Post = mongoose.model('Post')

const PhotoPost = Post.discriminator('PhotoPost',
  new Schema({
    mainImages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
  }))

export default PhotoPost;
