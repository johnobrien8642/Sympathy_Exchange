import User from './User.js';
import Image from './posts/util/Image.js';
import Audio from './posts/util/Audio.js';
import Video from './posts/util/Video.js';
import Tag from './posts/util/Tag.js';
import Mention from './posts/util/Mention.js';
import Like from './posts/util/Like.js';
import Comment from './posts/util/Comment.js';
import Repost from './posts/util/Repost.js';
import RepostCaption from './posts/util/RepostCaption.js'
import Follow from './posts/util/Follow.js';
import Post from './posts/types/Post.js';
import TextPost from './posts/types/TextPost.js';
import PhotoPost from './posts/types/PhotoPost.js';
import QuotePost from './posts/types/QuotePost.js';
import LinkPost from './posts/types/LinkPost.js';
import ChatPost from './posts/types/ChatPost.js'
import AudioPost from './posts/types/AudioPost.js'
import VideoPost from './posts/types/VideoPost.js'

const models = {
  User,
  Image,
  Audio,
  Video,
  Tag,
  Like,
  Comment,
  Repost,
  RepostCaption,
  Mention,
  Follow,
  Post,
  TextPost,
  PhotoPost,
  QuotePost,
  LinkPost,
  ChatPost,
  AudioPost,
  VideoPost
}

export default models;