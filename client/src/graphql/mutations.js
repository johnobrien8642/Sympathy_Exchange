import { gql } from '@apollo/client';
import AllPostQueryFragments from './all_posts_query_fragment.js'
const { ALL_POSTS } = AllPostQueryFragments;

const Mutations = {
  CREATE_PLEA: gql`
    mutation CreatePlea($pleaInputData: PleaInputType) {
      createPlea(pleaInputData: $pleaInputData) {
        _id
        text
        author {
          _id
          username
        }
        tagIds {
          _id
          title
        }
      }
    }
  `,
  REGISTER_USER: gql`
    mutation RegisterUser($registerUserInputData: RegisterUserInputType) {
      registerUser(registerUserInputData: $registerUserInputData) {
        _id
        token
        loggedIn
        username
        timedSecretRecoveryPhraseAccessToken
      }
    }
  `,
  GENERATE_USERNAME: gql`
    mutation GenerateUsername {
      generateUsername
    }
  `,
  LOGIN_USER: gql`
    mutation LoginUser($username: String!, $password: String!) {
      loginUser(username: $username, password: $password) {
        _id
        token
        loggedIn
        username
      }
    }
  `,
  LOGOUT_USER: gql`
  mutation LogoutUser($token: String!) {
    logoutUser(token: $token) {
      token
      loggedIn
      username
    }
  }
  `,
  VERIFY_USER: gql`
    mutation VerifyUser($token: String!) {
      verifyUser(token: $token) {
        loggedIn
      }
    }
  `,
  RECOVER_ACCOUNT: gql`
  mutation RecoverAccount($secretRecoveryPhrase: String) {
    recoverAccount(secretRecoveryPhrase: $secretRecoveryPhrase) {
      _id
      token
      loggedIn
      username
    }
  }
  `,
  LIKE_POST: gql`
    mutation LikePost($postId: ID, $user: String, $postKind: String) {
      likePost(postId: $postId, user: $user, postKind: $postKind) {
        _id
      }
    }
  `,
  UNLIKE_POST: gql`
    mutation unlikePost($likeId: ID, $postId: ID) {
      unlikePost(likeId: $likeId, postId: $postId) {
        _id
      }
    }
  `,
  FOLLOW: gql`
    mutation Follow($user: String, $item: String, $itemKind: String) {
      follow(user: $user, item: $item, itemKind: $itemKind) {
        __typename
        ... on UserType {
          _id
        }
        ... on TagType {
          _id
        }
      }
    }
  `,
  UNFOLLOW: gql`
    mutation Unfollow($user: String, $item: ID) {
      unfollow(user: $user, item: $item) {
        __typename
        ... on UserType {
          _id
        }
        ... on TagType {
          _id
        }
      }
    }
  `,
  CREATE_OR_UPDATE_POST: gql`
    mutation CreateOrUpdatePost($instanceData: JSONObject ) {
      createOrUpdatePost(instanceData: $instanceData) {
        __typename
       ${ALL_POSTS}
      }
    }
  `,
  DELETE_POST: gql`
    mutation deletePost($post: JSONObject ) {
      deletePost(post: $post)
    }
  `,
  UPDATE_REPOST: gql`
    mutation UpdateRepost($repostData: JSONObject) {
      updateRepost(repostData: $repostData) {
        _id
        kind
        user {
          _id
          username
          profilePic {
            _id
            src
          }
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
    }
  `,
  CREATE_REPOST: gql`
    mutation CreateRepost($repostData: JSONObject ) {
      repost(repostData: $repostData) {     
        _id
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
            ${ALL_POSTS}
          }
        }
    }
  `,
  COMMENT_POST: gql`
    mutation CommentPost($commentData: JSONObject) {
      comment(commentData: $commentData) {
        _id
        content
        user {
          _id
          username
        }
      }
    }
  `,
  DELETE_COMMENT: gql`
    mutation deleteComment($commentId: ID, $postId: ID) {
      deleteComment(commentId: $commentId, postId: $postId) {
        _id
      }
    }
  `,
  UPDATE_PROFILE_PIC: gql`
    mutation UpdateProfilePic($instanceData: JSONObject) {
      updateProfilePic(instanceData: $instanceData) {
        _id
        profilePic {
          _id
          src
        }
      }
    }
  `,
  UPDATE_USERNAME: gql`
    mutation UpdateUsername($username: String, $password: String, $user: String) {
      updateUsername(username: $username, password: $password, user: $user) {
        _id
        username
      }
    }
  `,
  UPDATE_USER_BLOG_DESCRIPTION: gql`
    mutation UpdateUserBlogDescription($blogDescription: String, $password: String, $user: String) {
      updateUserBlogDescription(blogDescription: $blogDescription, password: $password, user: $user) {
        _id
        username
      }
    }
  `,
  UPDATE_USER_PASSWORD: gql`
    mutation UpdateUserPassword($currentPW: String, $newPassword: String, $user: String) {
      updateUserPassword(currentPW: $currentPW, newPassword: $newPassword, user: $user) {
        _id
        email
        username
      }
    }
  `,
  ADD_FILTER_TAG: gql`
    mutation AddFilterTag($tag: String, $user: String) {
      addFilterTag(tag: $tag, user: $user) {
        filteredTags
      }
    }
  `,
  DELETE_FILTER_TAG: gql`
    mutation DeleteFilterTag($tag: String, $user: String) {
      deleteFilterTag(tag: $tag, user: $user) {
        filteredTags
      }
    }
  `,
  ADD_FILTER_POST_CONTENT: gql`
    mutation AddFilterPostContent($postContent: String, $user: String) {
      addFilterPostContent(postContent: $postContent, user: $user) {
        filteredPostContent
      }
    }
  `,
  DELETE_FILTER_POST_CONTENT: gql`
    mutation DeleteFilterPostContent($postContent: String, $user: String) {
      deleteFilterPostContent(postContent: $postContent, user: $user) {
        filteredPostContent
      }
    }
  `,
  DELETE_MY_ACCOUNT: gql`
    mutation DeleteMyAccount($query: String, $password: String, $token: String) {
      deleteMyAccount(query: $query, password: $password, token: $token)
    }
  `
};

export default Mutations;