import graphql from'graphql';
import PleaType from '../objects/plea_type.js';
import SaveType from '../objects/save_type.js';
import SympathyType from '../objects/sympathy_type.js';
import FollowType from '../objects/follow_type.js';
const { GraphQLUnionType } = graphql;

const SaveLikeFollowUnionType = new GraphQLUnionType({
  name: 'SaveLikeFollowUnionType',
  types: () => ( [ PleaType, FollowType, SaveType, SympathyType ] ),
  resolveType(value) {
    if (value.kind === 'Plea') {
      return PleaType;
    };
    if (value.kind === 'Follow') {
      return FollowType;
    };
    if (value.kind === 'Save') {
      return SaveType;
    };
    if (value.kind === 'Sympathy') {
      return SympathyType;
    };
  }
});

export default SaveLikeFollowUnionType;