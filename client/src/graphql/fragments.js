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
  `
}

export default Fragments;