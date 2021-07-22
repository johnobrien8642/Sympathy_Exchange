import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

import DeleteComment from '../social/Delete_Comment'
import ProfilePic from '../../../../user/util/components/Profile_Pic';

import Queries from '../../../../../graphql/queries';
import Mutations from '../../../../../graphql/mutations';
import FeedUtil from '../../functions/feed_util.js';
import UpdateCacheUtil from '../../functions/update_cache_util.js';
import PostFormUtil from '../../functions/post_form_util.js';
const { FETCH_LIKES_REPOSTS_AND_COMMENTS } = Queries;
const { COMMENT_POST } = Mutations;
const { handlePostNotesScrollOutOfWindow } = FeedUtil;
const { commentPost } = UpdateCacheUtil;
const { allowScroll, preventScroll } = PostFormUtil;

const PostNotes = ({
  post,
  notesCount,
  notes, 
  notesActive,
  setNotesActive, 
}) => {
  var [content, setContent] = useState('')

  useEffect(() => {
    var el = document.querySelector('.notes')

    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })

  useEffect(() => {
    var scroll = handlePostNotesScrollOutOfWindow(
      notesActive,
      setNotesActive
    )

    return () => {
      document.removeEventListener('scroll', scroll)
    }
  }, [notesActive, setNotesActive])

  useEffect(() => {
    if (notesActive) {
      preventScroll(notesActive, document)
    } else {
      allowScroll(document)
    }

    return () => {
      allowScroll(document)
    }
  }, [notesActive])

  let [comment] = useMutation(COMMENT_POST, {
    update(client, { data }) {
      let { comment } = data;
      let query = FETCH_LIKES_REPOSTS_AND_COMMENTS;

      commentPost(client, comment, post, query)
    },
    onCompleted() {
      setContent(content = '')
    }
  })

  const resolveKind = (note) => {
    if (note.kind === 'Repost') {
      return 'Repost'
    } else if (note.kind === 'Comment') {
      return 'Comment'
    } else if (note.kind === 'Like') {
      return 'Like'
    }
  }

  const handleSubmit = () => {
    let commentData = {}
    commentData.user = Cookies.get('currentUser')
    commentData.postAuthorId = post.user._id
    commentData.postId = post._id
    commentData.content = content
    commentData.kind = post.kind

    comment({
      variables: {
        commentData: commentData
      }
    })
  }
  
  if (notesActive) {
    return (
      <div
        className='postNotes'
        tabIndex={-1}
      >
        <div
          className='notesHeader'
        >
          <img
            className='backBtn'
            src="https://img.icons8.com/windows/64/000000/long-arrow-left.png"
            alt=''
            onClick={() => {
              if (window.innerHeight < 980) {
                allowScroll(document)
              }

              setNotesActive(notesActive = false)              
            }}
          />
          <span>{notesCount} notes</span>
        </div>

        <ul
          className='notes'
        >
          {notes.map((n, i) => {
            var note = resolveKind(n)
            if (note === 'Comment') {
              return (
                <li
                  key={n._id}
                >
                  <div
                    className='noteProfilePicContainer'
                  >
                    <ProfilePic
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader'
                    >
                      <Link
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>

                      <div>
                        <DeleteComment
                          post={post}
                          comment={n}
                        />
                      </div>
                    </div>
                    <p>{n.content}</p>
                  </div>
                </li>
              )
            } else if (note === 'Repost') {

              var caption
              n.repostTrail.forEach(captionObj => {
                if (captionObj.user._id === n.user._id) {
                  caption = captionObj.caption
                }
              })

              return (
                <li
                  key={n._id}
                >
                  <div
                    className='noteProfileContainer'
                  >
                    <ProfilePic 
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader repost'
                    >
                      <Link
                        className='user'
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>

                      <div
                        className='repostIconAndRepostFromContainer'
                      >
                        <img
                          className='repostIconHeader'
                          src="https://img.icons8.com/material-outlined/64/000000/retweet.png"
                          alt=''
                        />

                        <Link
                          className='repostedFrom'
                          to={`/view/blog/${n.repostedFrom.blogName}`}
                        >
                          {n.repostedFrom.blogName}
                        </Link>
                      </div>
                    </div>
                    
                    <div
                      className='noteRepostCaption'
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(caption)
                      }}
                    />
                  </div>
                </li>
              )
            } else if (note === 'Like') {
              return (
                <li
                  key={n._id}
                >

                  <div
                    className='noteProfilePicContainer'
                  >
                    <ProfilePic
                      user={n.user}
                      activity={n}
                    />
                  </div>

                  <div
                    className='noteContentContainer'
                  >
                    <div
                      className='noteContentHeader'
                    >
                      <Link
                        to={`/view/blog/${n.user.blogName}`}
                      >
                        {n.user.blogName}
                      </Link>
                    </div>

                    <p>likes this</p>
                  </div>
                </li>
              )
            } else {
              return (
                <div>
                </div>
              )
            }
          })}
        </ul>

        <div
          className='commentInputContainer'
        > 
          <textarea
            value={content}
            placeholder={'Speak your mind...'}
            onChange={e => {
              setContent(content = e.target.value)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSubmit()
              }
            }}
          ></textarea>

          <button
            type='button'
            disabled={!content}
            onClick={() => {
              handleSubmit() 
            }}
          >
            Reply
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default PostNotes;