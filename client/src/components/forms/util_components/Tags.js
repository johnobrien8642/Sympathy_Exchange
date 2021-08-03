import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import Queries from '../../../graphql/queries.js';
const { FETCH_ALL_TAGS } = Queries;

const Tags = ({
  tags,
  addOrRemoveTagCB,
  tagListActive,
  setTagListActive
}) => {
  let [input, setInput] = useState('');
  let [alertActive, setAlertActive] = useState(false);
  let tagListRef = useRef(null);
  let contentEditableDivTagInputRef = useRef(null);
  
  let { data } = useQuery(FETCH_ALL_TAGS);

  useEffect(() => {
    if (alertActive) {
      setTimeout(() => {
        setAlertActive(false);
      }, 2000);
    }
  }, [alertActive]);

  if (data) {

    const { fetchAllTags } = data;
    let regex = new RegExp(input, 'i');
    var filteredTags = fetchAllTags.filter(tag => regex.test(tag.title));
    
    return (
      <div
        className='tagsContainer'
      >
        <p
         className={alertActive ? 'alert' : 'alert hidden'}
        >
          3 tags max
        </p>
        <div
          className='innerTagsContainer'
        >
          <ul
           className='chosenTags'
          >
            {tags.map(tag => {
             return (
               <li
                key={tag._id}
               >
                 {tag.title}
                 <div
                  className='removeIcon'
                  onClick={() => {
                    addOrRemoveTagCB(tag)
                  }}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                 </div>
               </li>
             )
            })}
            <li
              className='tagInput'
            >
              <div
                tabIndex={-1}
                className='contentEditableDivTagInput'
                ref={contentEditableDivTagInputRef}
                contentEditable='true'
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredTags.length === 1) {
                    e.preventDefault();
                    addOrRemoveTagCB(filteredTags[0]);
                    setInput('');
                    contentEditableDivTagInputRef.current.textContent = '';
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                onInput={e => {
                  setInput(e.target.textContent);
                }}
                onClick={e => {
                  e.stopPropagation();
                  setTagListActive(true);
                }}
              />

            </li>
          </ul>

          <ul
            ref={tagListRef}
            className={tagListActive ? 'tagList active' : 'tagList'}
          >
           {filteredTags.map(tag => {
             return (
                <li
                  key={tag._id}
                  onClick={() => {
                    if (tags.length === 3) {
                      setAlertActive(true);
                    } else {
                      addOrRemoveTagCB(tag);
                      setTagListActive(false);
                    };
                  }}
                >
                  <div>
                    <span>{tag.title}</span>
                    <span>{tag.postCount}</span>
                  </div>
                  <p>
                    {tag.description}
                  </p>
                </li>
             )
           })}
          </ul>
        </div>
    </div>
   )
  } else {
    return (
      <React.Fragment />
    )
  }
};

export default Tags;