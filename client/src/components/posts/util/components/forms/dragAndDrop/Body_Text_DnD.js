import React from 'react';
import { useApolloClient } from '@apollo/client';
import randomstring from 'randomstring';
import DOMPurify from 'dompurify';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import Queries from '../../../../../../graphql/queries.js';
import PostFormUtil from '../../../functions/post_form_util.js';
const { FETCH_USERS_FOR_MENTIONS } = Queries;
const { removeBodyObj, drag, 
        onDropBody, allowDrop, MentionCustomization } = PostFormUtil;

const BodyTextDnD = ({
  bodyIdx,
  text, body,
  bodyImageFiles,
  setBodyImageFiles,
  objsToClean,
  render, setRender,
}) => {
  const client = useApolloClient();

  const editorConfiguration = {
    extraPlugins: [MentionCustomization],
    balloonToolbar: [
      'bold',
      'italic',
      'underline',
      'link',
      'blockQuote',
      'undo',
      'redo'
    ],
    mention: {
      feeds: [
        {
          marker: '@',
          feed: query => {
            return client.query({
              query: FETCH_USERS_FOR_MENTIONS,
              variables: {
                filter: query
              }
            }).then(res => {
              return res.data.fetchUsersForMentions.map(u => ({
                id: '@' + u.blogName,
                actualId: randomstring.generate({
                  length: 12,
                  charset: 'alphabetic'
                })
              }))
            })
          },
          minimumCharacters: 1
        }
      ]
    }
  }

  return (
    <div
      id={text.uniqId}
      className='draggable textContentContainer'
      onDrop={e => {
        onDropBody(
          e, bodyIdx, body,
          bodyImageFiles,
        )
        
        setRender(render + 1)
      }}
      onDragStart={e => drag(e, bodyIdx, JSON.stringify(text))}
      onDragOver={e => allowDrop(e)}
      draggable='true'
    >
      <CKEditor
        id={`${text.uniqId}`}
        editor={ Editor }
        config={ editorConfiguration }
        data={DOMPurify.sanitize(text.content)}
        onChange={(e, editor) => {
          body.current[bodyIdx].content = editor.getData()
        }}
        onBlur={() => {
          if (body.current[bodyIdx].content === '') {
            removeBodyObj(
              text.srcType, body,
              setBodyImageFiles,
              bodyImageFiles,
              objsToClean, bodyIdx
            )

            setRender(render + 1)
          }
        }}
      />
    </div>
  )
}

export default BodyTextDnD;