import graphql from'graphql';
import RepostType from '../objects/posts/util/repost_type.js';
import RepostCaptionType from '../objects/posts/util/repost_caption_type.js';
const { GraphQLUnionType } = graphql;

const RepostOrRepostCaptionType = new GraphQLUnionType({
  name: 'RepostOrRepostCaptionType',
  types: () => [ 
    RepostType, RepostCaptionType
  ],
  resolveType(value) {
    console.log(value)
    if (value.kind === 'Repost') {
      return RepostType
    } else if (value.kind === 'RepostCaption') {
      return RepostCaptionType
    }
  }
})

export default RepostOrRepostCaptionType;