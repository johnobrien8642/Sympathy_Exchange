import { gql } from '@apollo/client';

const Fragments = {
  PLEA_FRAGMENT: gql `
    fragment PleaFragment on PleaType {
      _id
      text
      author {
        _id
        username
      }
      tagIds {
        _id
        title
        description
      }
      chained
      pleaIdChain {
        _id
        text
        author {
          _id
          username
        }
      }
      sympathyCount
      createdAt
      kind
      __typename
    }
  `,
  NESTED_PLEA_FRAGMENT: gql`
    fragment NestedPleaFragment on PleaType {
      _id
      text
      author {
        _id
        username
      }
      tagIds {
        _id
        title
        description
      }
      chained
      pleaIdChain {
        ...PleaFragment
      }
      sympathyCount
      createdAt
      kind
      __typename
    }
  `,
  FULL_TAG_FRAGMENT: gql`
    fragment FullTagFragment on TagType {
      _id
      title
      description
      postCount
      __typename
    }
  `,
  TITLE_ONLY_TAG_FRAGMENT: gql`
    fragment TitleOnlyTagFragment on TagType {
      _id
      title
      __typename
    }
  `
}

export default Fragments;