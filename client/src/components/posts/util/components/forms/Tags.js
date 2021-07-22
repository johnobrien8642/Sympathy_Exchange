import React, { useEffect } from 'react';

import MatchedTagResults from './Matched_Tag_Results'

import PostFormUtil from '../../functions/post_form_util.js'
import PostUpdateUtil from '../../functions/post_update_util.js'
const { pushTags } = PostUpdateUtil;
const { handleTagInput, removeTag } = PostFormUtil;

const Tags = ({
  post, 
  tags, 
  setTags,
  tag, 
  setTag
}) => {

  useEffect(() => {
    if (post) {
      pushTags(post.tagIds, tags, setTags)
    }  
    //eslint-disable-next-line
  }, [])

  return (
    <div
      className='tagsContainer'
    >
      {tags.map((tag, i) => {
        return (
          <div
            className='tagDiv'
            key={i}
          >
            {tag}
            <span
              className='removeTag'
              onClick={() => {
                removeTag(i, tags, setTags)
              }}
            >
              <span>x</span>
            </span>
          </div>
        )
      })}

      <div
        className='tagInputAndDDContainer'
      >
        <input
          type='text'
          value={tag}
          placeholder='#tags'
          onChange={e => setTag(tag = e.target.value)}
          onKeyDown={e => {
            if (
              (e.key === 'Enter' && tag) ||
              (e.key === '#' && tag)
            ) {
              handleTagInput(
                  tag, setTag,
                  tags, setTags
                )
              }
            }
          }
          onClick={e => {
            if (tag) {
              handleTagInput(
                tag, setTag,
                tags, setTags
              )
            }
          }}
          onBlur={e => {
            if (e && e.relatedTarget) {
              var formClasses = [...e.relatedTarget.classList]

              if (
                (formClasses[0] === 'browserPostsNav' ||
                formClasses.includes('ck') ||
                formClasses[0] === 'titleInput' ||
                !e.relatedTarget) &&
                tag
              ) {
                handleTagInput(
                  tag, setTag,
                  tags, setTags
                )
              }
            }
          }}
        />

        <MatchedTagResults 
          query={tag}
          tags={tags}
          setTags={setTags}
          tag={tag}
          setTag={setTag}
        />
      </div>
    </div>
  )

}

export default Tags;