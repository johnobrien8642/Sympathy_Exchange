import graphql from'graphql';
import LikeType from '../objects/posts/util/like_type.js';
import RepostType from '../objects/posts/util/repost_type.js';
import CommentType from '../objects/posts/util/comment_type.js';
const { GraphQLUnionType } = graphql;

const LikeRepostAndCommentType = new GraphQLUnionType({
  name: 'LikeRepostAndCommentType',
  types: [ LikeType, RepostType, CommentType ],
  resolveType(value) {
    if (value.kind === 'Like') {
      return LikeType
    } else if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'Comment') {
      return CommentType
    }
  }
})

export default LikeRepostAndCommentType;