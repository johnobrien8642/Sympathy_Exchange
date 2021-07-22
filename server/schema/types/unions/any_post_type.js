import graphql from'graphql';
import RepostType from '../objects/posts/util/repost_type.js'
import TextPostType from '../objects/posts/types/text_post_type.js';
import PhotoPostType from '../objects/posts/types/photo_post_type.js';
import QuotePostType from '../objects/posts/types/quote_post_type.js';
import LinkPostType from '../objects/posts/types/link_post_type.js';
import ChatPostType from '../objects/posts/types/chat_post_type.js';
import AudioPostType from '../objects/posts/types/audio_post_type.js';
import VideoPostType from '../objects/posts/types/video_post_type.js';
const { GraphQLUnionType } = graphql;

const AnyPostType = new GraphQLUnionType({
  name: 'AnyPostType',
  types: () => [ 
    RepostType, TextPostType, 
    PhotoPostType, QuotePostType,
    LinkPostType, ChatPostType,
    AudioPostType, VideoPostType
  ],
  resolveType(value) {
    if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'TextPost') {
      return TextPostType
    } else if (value.kind === 'PhotoPost') {
      return PhotoPostType
    } else if (value.kind === 'QuotePost') {
      return QuotePostType
    } else if (value.kind === 'LinkPost') {
      return LinkPostType
    } else if (value.kind === 'ChatPost') {
      return ChatPostType
    } else if (value.kind === 'AudioPost') {
      return AudioPostType
    } else if (value.kind === 'VideoPost') {
      return VideoPostType
    }
  }
})

export default AnyPostType;