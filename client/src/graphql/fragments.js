import { gql } from '@apollo/client';

const Fragments = {
  PLEA_FRAGMENT: gql `
    fragment PleaFragment on PleaType {
      _id
      text
      authorId {
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
        authorId {
          _id
          username
        }
      }
      sympathyCount
      combinedSympathyCount
      createdAt
      kind
      __typename
    }
  `,
  NESTED_PLEA_FRAGMENT: gql`
    fragment NestedPleaFragment on PleaType {
      _id
      text
      authorId {
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
      combinedSympathyCount
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
      kind
      __typename
    }
  `,
  USER_FRAGMENT: gql`
    fragment UserFragment on UserType {
      _id
      username
      kind
      __typename
    }
  `
}

export default Fragments;