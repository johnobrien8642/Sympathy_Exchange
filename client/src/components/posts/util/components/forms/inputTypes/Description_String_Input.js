import React from 'react';
import { useApolloClient } from '@apollo/client';
import randomstring from 'randomstring';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import Queries from '../../../../../../graphql/queries.js'
import PostFormUtil from '../../../functions/post_form_util.js'
const { MentionCustomization } = PostFormUtil;
const { FETCH_USERS_FOR_MENTIONS } = Queries;


const DescriptionStringInput = ({
  body, 
  description,
  setDescription,
  repost,
}) => {
  const client = useApolloClient();

  const handlePlaceholder = () => {
    if (repost) {
      return 'Enter a caption'
    } else {
      return 'Your text here'
    }
  }

  const editorConfiguration = {
    extraPlugins: [MentionCustomization],
    placeholder: handlePlaceholder(),
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

  if (repost) {
    return (
      <React.Fragment>
        <div
          className='descriptionStringContainer'
        >
          <CKEditor
            editor={ Editor }
            config={
              editorConfiguration 
            }
            onChange={(e, editor) => {
              setDescription(description = editor.getData())
            }}
          />
        </div>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <div
          className='descriptionStringContainer'
        >
          <CKEditor
            editor={ Editor }
            config={
              editorConfiguration 
            }
            onChange={(e, editor) => {
              setDescription(description = editor.getData())
            }}
            onReady={(editor, description) => {
  
              editor.editing.view.document.on('keydown', (evt, data) => {
                if (data.domEvent.key === 'Enter' && editor.getData()) {
                  var textObj = {
                    kind: 'text',
                    srcType: 'text',
                    content: editor.getData(),
                    displayIdx: body.current.length,
                    uniqId: randomstring.generate({
                      length: 12,
                      charset: 'alphabetic'
                    })
                  }
  
                  body.current.push(textObj)
                  editor.setData('<p class="ck-placeholder" data-placeholder="Your text here"><br data-cke-filler="true"></p>')
                }
              })
            }}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default DescriptionStringInput;