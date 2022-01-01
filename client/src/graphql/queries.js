import { gql } from '@apollo/client';
import AllPostQueryFragment from './all_posts_query_fragment.js';
import Fragments from './fragments.js';
const { NESTED_PLEA_FRAGMENT, PLEA_FRAGMENT, TITLE_ONLY_TAG_FRAGMENT, USER_FRAGMENT } = Fragments;
const { ALL_POSTS, ALL_POSTS_ACTIVITY } = AllPostQueryFragment;

const Queries = {
  FETCH_USER: gql`
    query FetchUser($userId: String) {
      user(userId: $userId) {
        _id
        username
        userFollows {
          _id
          username
        }
        tagFollows {
          _id
          title
        }
        sympathizedPleaIdsStringArr
        savedPleaIdsStringArr
        userFollowIdsStringArr
        tagFollowIdsStringArr
        kind
      }
    }
  `,
  FETCH_PLEA: gql`
    query FetchPlea($pleaId: ID) {
      plea(pleaId: $pleaId) {
        ...NestedPleaFragment
      }
    }
    ${NESTED_PLEA_FRAGMENT}
  `,
  FETCH_SECRET_RECOVERY_PHRASE_AFTER_REGISTER: gql`
    query FetchSecretRecoveryPhraseAfterRegister($timedToken: String) {
      fetchSecretRecoveryPhraseAfterRegister(timedToken: $timedToken)
    }
  `,
  FETCH_SECRET_RECOVERY_PHRASE: gql`
    query FetchSecretRecoveryPhrase($token: String) {
      fetchSecretRecoveryPhrase(token: $token)
    }
  `,
  FETCH_TAG: gql`
    query FetchTag($tagId: ID) {
      tag(tagId: $tagId) {
        _id
        title
      }
    }
  `,
  FETCH_SEARCH_RESULTS: gql`
    query FetchSearchResults($searchInput: String) {
      fetchSearchResults(searchInput: $searchInput) {
        __typename
        ... on PleaType {
          ...NestedPleaFragment
        }
        ... on TagType {
          ...TitleOnlyTagFragment
        }
        ... on UserType {
          ...UserFragment
        }
      }
    }
    ${NESTED_PLEA_FRAGMENT}
    ${PLEA_FRAGMENT}
    ${TITLE_ONLY_TAG_FRAGMENT}
    ${USER_FRAGMENT}
  `,
  // FETCH_ALL_TAGS: gql`
  //   query FetchAllTags {
  //     fetchAllTags {
  //       _id
  //       title
  //       description
  //       postCount
  //     }
  //   }
  // `,
  FETCH_FEED: gql`
    query FetchFeed($fetchFeedInputs: FetchFeedInputType) {
      fetchFeed(fetchFeedInputs: $fetchFeedInputs) {
        __typename
        ... on PleaType {
          ...NestedPleaFragment
        }
        ... on SaveType {
          _id
          kind
          user {
            ...UserFragment
          }
          plea {
            ...NestedPleaFragment
          }
        }
        ... on SympathyType {
          _id
          kind
          user {
            ...UserFragment
          }
          plea {
            ...NestedPleaFragment
          }
        }
        ... on FollowType {
          _id
          kind
          user {
            ...UserFragment
          }
        }
      }
    }
    ${NESTED_PLEA_FRAGMENT}
    ${PLEA_FRAGMENT}
    ${USER_FRAGMENT}
  `,
  RECENTS: gql`
    query Recents {
      recents {
        ...NestedPleaFragment
      }
    }
    ${NESTED_PLEA_FRAGMENT}
    ${PLEA_FRAGMENT}
  `,
  FETCH_MAX_PARAMETER_FOR_FILTER: gql`
    query FetchMaxParameterForFilter($tagId: ID) {
      fetchMaxParameterForFilter(tagId: $tagId) {
        integerLength
        ceiling
      }
    }
  `,
  FETCH_ALL_TAGS: gql`
    query FetchAllTags {
      fetchAllTags {
        ...TitleOnlyTagFragment
      }
    }
    ${TITLE_ONLY_TAG_FRAGMENT}
  `,
  FETCH_USER_FEED: gql`
    ${NESTED_PLEA_FRAGMENT}
    query FetchUserFeed($query: String, $cursorId: String) {
      fetchUserFeed(query: $query, cursorId: $cursorId) {
        ...NestedPleaFragment
      }
    }
  `,
  FETCH_TAG_FEED: gql`
    query FetchTagFeed($query: String, $cursorId: String) {
      fetchTagFeed(query: $query, cursorId: $cursorId) {
        __typename
        ${ALL_POSTS}
      }
    }
  `,
  
  FETCH_USER_LIKES: gql`
    query FetchUserLikes($query: String) {
      fetchUserLikes(query: $query) {
        _id
        kind
        user {
          _id
          username
        }
        post {
          __typename
          ... on RepostType {
            _id
            kind
            post {
              __typename
              ${ALL_POSTS}
            }
          }
          ${ALL_POSTS}
        }
      }
    }
  `,
  FETCH_FOLLOWED_USERS: gql`
    query fetchFollowedUsers($query: String, $cursorId: String) {
      fetchFollowedUsers(query: $query, cursorId: $cursorId) {
        _id
        follows {
          __typename
          ... on UserType {
            _id
            username
            kind
          }
        }
      }
    }
  `,
  FETCH_USER_FOLLOWERS: gql`
    query FetchUserFollowers($query: String, $cursorId: String) {
      fetchUserFollowers(query: $query, cursorId: $cursorId) {
        _id
        user {
          _id
          username
        }
      }
    }
  `,
  FETCH_CURRENT_USER_BLOG: gql`
    query fetchUserBlog($query: String) {
      user(query: $query) {
        _id
        posts {
          __typename
          ${ALL_POSTS}
        }
      }
    }
  `,
  FETCH_USER_BLOG_FEED: gql`
    query fetchUserBlogFeed($query: String) {
      fetchUserBlogFeed(query: $query) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            username
          }
          repostTrail {
            _id
            caption
            user {
              _id
              username
            }
            repost {
              _id
            }
          }
          repostedFrom {
            _id
            username
            kind
          }
          post {
            __typename
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
  FETCH_USER_DETAILS_COUNTS: gql`
    query FetchUserDetailsCounts($query: String) {
      user(query: $query) {
        _id
        username
        email
      }
    }
  `,
  FETCH_USER_DETAILS: gql`
    query fetchUserDetails($query: String) {
      user(query: $query) {
        _id
        username
      }
    }
  `,
  FETCH_USER_FOLLOWED_TAGS: gql`
    query fetchUserAndFollowedTags($query: String) {
      user(query: $query) {
        _id
        tagFollows {
          _id
          title
        }
      }
    }
  `,
  SEARCH_USERS_AND_TAGS: gql`
    query SearchUsersAndTags($filter: UserAndTagInputType) {
      usersAndTags(filter: $filter) {
        __typename
        ... on UserType {
          _id
          username
          email
          kind
        }
        ... on TagType {
          _id
          title
          kind
        }
      }
    }
  `,
  FETCH_MATCHING_TAGS: gql`
    query FetchMatchingTags($filter: String) {
      fetchMatchingTags(filter: $filter) {
        _id
        title
      }
    }
  `,
  FETCH_POST: gql`
    query FetchPost($query: ID) {
      post(query: $query) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            username
          }
          repostedFrom {
            _id
            username
          }
          repostTrail {
            _id
            caption
            user {
              _id
              username
            }
            repost {
              _id
            }
          }
          post {
            __typename
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
  FETCH_LIKES_REPOSTS_AND_COMMENTS: gql`
  query FetchLikesRepostsAndComments($postId: ID) {
    fetchLikesRepostsAndComments(postId: $postId) {
        __typename
        ... on LikeType {
          _id
          kind
          user {
            _id
            username
          }
        }
        ... on RepostType {
          _id
          kind
          user {
            _id
            username
          }
          repostedFrom {
            _id
            username
          }
          repostTrail {
            _id
            caption
            user {
              _id
            }
            repost {
              _id
            }
          }
        }
        ... on CommentType {
          _id
          kind
          content
          user {
            _id
            username
          }
        }
      }
    }
  `,
  FETCH_ALL_ACTIVITY: gql`
  query FetchAllUserActivity($query: String, $cursorId: String) {
    fetchAllUserActivity(query: $query, cursorId: $cursorId) {
        __typename
        ... on MentionType {
          _id
          kind
          user {
            _id
            username
          }
          post {
            __typename
            ... on RepostType {
              _id
              kind
              repostTrail {
                _id
                caption
                user {
                  _id
                }
                repost {
                  _id
                }
              }
              post {
                __typename
                ${ALL_POSTS_ACTIVITY}
              }
            }
            ${ALL_POSTS_ACTIVITY}
          }
          createdAt
        }
        ... on RepostType {
          _id
          kind
          repostTrail {
            _id
            caption
            user {
              _id
            }
            repost {
              _id
            }
          }
          user {
            _id
            username
          }
          repostedFrom {
            _id
            username
          }
          post {
            __typename
            ${ALL_POSTS_ACTIVITY}
          }
          createdAt
        }
        ... on CommentType {
          _id
          kind
          content
          user {
            _id
            username
          }
          post {
            __typename
            ... on RepostType {
              _id
              kind
              user {
                _id
                username
              }
              post {
                __typename
                ${ALL_POSTS_ACTIVITY}
              }
            }
            ${ALL_POSTS_ACTIVITY}
          }
          createdAt
        }
        ... on CommentType {
          _id
          kind
          content
          user {
            _id
            username
          }
          post {
            __typename
            ... on RepostType {
              _id
              kind
              post {
                __typename
                ${ALL_POSTS_ACTIVITY}
              }
            }
            ${ALL_POSTS_ACTIVITY}
          }
          createdAt
        }
        ... on FollowType {
          _id
          kind
          user {
            _id
            username
          }
          follows {
            __typename
            ... on TagType {
              _id
            }
            ... on UserType {
              _id
              username
            }
          }
          createdAt
        }
        ... on LikeType {
          _id
          kind
          user {
            _id
            username
          }
          post {
            __typename
            ... on RepostType {
              _id
              kind
              post {
                __typename
                ${ALL_POSTS_ACTIVITY}
              }
            }
            ${ALL_POSTS_ACTIVITY}
          }
          createdAt
        }
      }
    }
  `,
  FETCH_ACTIVITY_COUNTS: gql`
    query FetchActivityCount($query: String, $cursorId: String) {
      fetchActivityCount(query: $query, cursorId: $cursorId)
    }
  `,
  FETCH_USERS_FOR_MENTIONS: gql`
    query FetchUsersForMentions($filter: String) {
      fetchUsersForMentions(filter: $filter) {
        _id
        username
      }
    }
  `,
  FETCH_RECOMMENDED_TAGS: gql`
    query FetchRecommendedTags($query: String) {
      fetchRecommendedTags(query: $query) {
        _id
        title
        postHeatLastWeek
      }
    }
  `,
  FETCH_DISCOVER_FEED: gql`
    query FetchDiscoverFeed($query: String) {
      fetchDiscoverFeed(query: $query) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            username
          }
          repostTrail {
            _id
            caption
            user {
              _id
              username
            }
            repost {
              _id
            }
          }
          repostedFrom {
            _id
            username
            kind
          }
          post {
            __typename
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
  DOES_USER_LIKE_POST: gql`
    query DoesUserLikePost($user: String, $postId: ID) {
      doesUserLikePost(user: $user, postId: $postId) {
        _id
      }
    }
  `,
  DOES_USER_FOLLOW_USER: gql`
    query DoesUserFollowUser($user: String, $otherUser: String) {
      doesUserFollowUser(user: $user, otherUser: $otherUser) {
        _id
      }
    }
  `,
  DOES_USER_FOLLOW_TAG: gql`
    query DoesUserFollowTag($query: String, $tagId: ID) {
      doesUserFollowTag(query: $query, tagId: $tagId) {
        _id
      }
    }
  `,
  IS_LOGGED_IN: gql`
    query isLoggedIn {
      isLoggedIn @client
    }
  `,
  CURRENT_USER_ID: gql`
    query currentUser {
      currentUserId @client
    }
  `,
  AUTH_TOKEN: gql`
    query currentUser {
      authToken @client
    }
  `,
  FETCH_POST_RADAR: gql`
    query FetchPostRadar($query: String) {
      fetchPostRadar(query: $query) {
        __typename
        ... on RepostType {
          _id
          kind
          user {
            _id
            username
          }
          repostTrail {
            _id
            caption
            user {
              _id
              username
            }
            repost {
              _id
            }
          }
          repostedFrom {
            _id
            username
            kind
          }
          post {
            __typename
            ${ALL_POSTS}
          }
        }
        ${ALL_POSTS}
      }
    }
  `,
}

export default Queries;