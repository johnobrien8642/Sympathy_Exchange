import graphql from'graphql';
import UserType from '../objects/user_type.js';
import TagType from '../objects/tag_type.js';
import PleaType from '../objects/plea_type.js';
const { GraphQLUnionType } = graphql;

const PleaAndUserAndTagType = new GraphQLUnionType({
  name: 'PleaAndUserAndTagType',
  types: () => ( [ PleaType, UserType, TagType ] ),
  resolveType(value) {
    if (value.kind === 'Plea') {
      return PleaType;
    };
    if (value.kind === 'User') {
      return UserType;
    };
    if (value.kind === 'Tag') {
      return TagType;
    };
  }
});

export default PleaAndUserAndTagType;