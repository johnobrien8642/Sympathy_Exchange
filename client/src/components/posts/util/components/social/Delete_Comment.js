import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
const { DELETE_COMMENT } = Mutations;
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries

const DeleteComment = ({
  post, 
  comment
}) => {
  let [active, setActive] = useState(false)
  
  let [deleteComment] = useMutation(DELETE_COMMENT, {
    update(client) {
      var query = FETCH_LIKES_REPOSTS_AND_COMMENTS
      
      var readFeed = client.readQuery({
        query: query,
        variables: {
          postId: post._id
        }
      })
      
      var { fetchLikesRepostsAndComments } = readFeed;
      
      var newPostArr = fetchLikesRepostsAndComments.filter(note => {
        if (note._id === comment._id) {
          return false
        } else {
          return true
        }
      })

      client.writeQuery({
        query: query,
        variables: {
          postId: post._id
        },
        data: {
          fetchLikesRepostsAndComments: newPostArr
        }
      })
    },
    onCompleted() {
      setActive(active = false)
    }
  })

  if (comment.user.blogName === Cookies.get('currentUser')) {
    if (active) {
      return (
        <React.Fragment>
          <img
              className='commentOptions active'
              src="https://img.icons8.com/ios-glyphs/64/000000/more.png"
              alt=''
              onClick={() => {
                setActive(active = false)
              }}
            />
          <div
            className='deleteCommentContainer'
          >
            <div
              className='deleteCommentBtn'
              onClick={() => {
                deleteComment({
                  variables: {
                    commentId: comment._id,
                    postId: post._id
                  }
                })
              }}
            >
              Delete reply
            </div>
            <div
              className='closeCommentBtn'
              onClick={() => {
                setActive(active = false)
              }}
            >
              Close
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <img
            className='commentOptions'
            src="https://img.icons8.com/ios-glyphs/64/000000/more.png"
            alt=''
            onClick={() => {
              setActive(active = true)
            }}
          />
        </React.Fragment>
      )
    }
  } else {
    return (
      <div>
      </div>
    )
  }

}

export default DeleteComment;