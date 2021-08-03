import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Tags from './util_components/Tags';
import ConfirmClose from './util_components/Confirm_Close';
import Mutations from '../../graphql/mutations.js';
const { CREATE_PLEA } = Mutations;

const PleaForm = ({
  open,
  close,
  user
}) => {
  let [plea, setPlea] = useState('');
  let [tagListActive, setTagListActive] = useState(false);
  let [showConfirmClose, setShowConfirmClose] = useState(false);
  let [showTagAlert, setShowTagAlert] = useState(false);
  let [pleaLengthAlert, setPleaLengthAlert] = useState(false);
  let [perspectiveAlert, setPerspectiveAlert] = useState(false);
  let [tag, setTag] = useState('');
  let [tags, setTags] = useState([]);
  let contentEditableDivRef = useRef(null);
  
  useEffect(() => {
    contentEditableDivRef.current.focus();
  }, []);

  useEffect(() => {
    if (showTagAlert) {
      setTimeout(() => {
        setShowTagAlert(false);
      }, 1200);
    }

    if (perspectiveAlert) {
      setTimeout(() => {
        setPerspectiveAlert(false);
      }, 1500);
    }
  }, [showTagAlert, perspectiveAlert]);

  useEffect(() => {
    var noFirstPerson = new RegExp(/(?<=\s|^)(?:I|I'd|I'd've|I'll|I'm|Imma|Im|Ill|Id|I've|Ive|Iv){1,}(?=\s)/, 'gmi');
    
    if (noFirstPerson.test(plea)) {
      setTimeout(() => {
        if (plea.length === 1) {
          setPlea('');
        } else {
          var cleanedStr = plea.replace(noFirstPerson, '').trimEnd();
          setPlea(cleanedStr);
          contentEditableDivRef.current.textContent = cleanedStr;
          placeCaretAtEnd(contentEditableDivRef.current);
          setPerspectiveAlert(true);
        }
      }, 200)
    };
    
  }, [plea]);

  let [createPlea] = useMutation(CREATE_PLEA, {
    onCompleted() {
      close(false);
    }
  })

  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
  }

  const reset = () => {
    setPlea('');
    setTag('');
    setTags([]);
    setShowConfirmClose(false);
    contentEditableDivRef.current.textContent = '';
  };

  const addOrRemoveTag = (tag) => {
    let index = tags.findIndex(obj => obj.title === tag.title);
    var newTags = [...tags];
    
    if (index > -1) {
      newTags.splice(index, 1);
      setTags(newTags);
    } else {
      newTags.push(tag);
      setTags(newTags);
    };
  };

  return (
    <div
      className={open ? 'pleaFormContainer active' : 'pleaFormContainer none'}
    >
      <div 
        className='pleaFormModal'
        onClick={() => {
          setTagListActive(false);
        }}
      >

        <form
          tabIndex={-1}
          onSubmit={e => {
            e.preventDefault();

            createPlea({
              variables: {
                pleaInputData: {
                  author: user._id,
                  text: plea,
                  tags: tags
                }
              }
            })
          }}
        >

          <div
            className='header'
          >
            <h3>{user ? user.username : ''}</h3>
            <Link
              to='/rules'
              onClick={() => {
                close(false);
              }}
            >
              plea rules
            </Link>
            <span 
              className={perspectiveAlert ? 'perspectiveAlert active' : 'perspectiveAlert'}
            >
              Second or third person perspective only, no 'I'!
            </span>
          </div>

          <div
            className='innerContentEditableDivContainer'
          >
            <div
              className='contentEditableDiv'
              contentEditable='true'
              ref={contentEditableDivRef}
              onInput={e => {

                if (e.target.textContent.length < 1000) {
                  setPlea(e.target.textContent);
                  setPleaLengthAlert(false);
                } else {
                  setPlea(e.target.textContent);
                  setPleaLengthAlert(true);
                }
              }}
            />
            <div>
              <span><span className={plea.length > 1000 ? 'charCount red' : 'charCount'}>{1000 - plea.length}</span> characters left</span>
              <span className={pleaLengthAlert ? 'pleaLengthAlert active' : 'pleaLengthAlert'}>1000 characters max</span>
            </div>
          </div>

          <Tags 
            tag={tag}
            setTag={setTag}
            tags={tags}
            setTags={setTags}
            tagListActive={tagListActive}
            setTagListActive={setTagListActive}
            addOrRemoveTagCB={addOrRemoveTag}
          />

          <div
            className='closeOrSubmitContainer'
          >
            <button
              type='button'
              className='close'
              onClick={() => {
                if (plea) {
                  setShowConfirmClose(true);
                } else {
                  reset();
                  close(false);
                };
              }}
            >
              Close
            </button>

            <div>
              <p
                className={showTagAlert ? 'tagAlert' : 'tagAlert none'}
              >
                Select at least 1 tag
              </p>

              <button
                className='submit'
                type='submit'
                onClick={e => {
                  if (tags.length === 0) {
                    e.preventDefault();
                    setShowTagAlert(true);
                  } else if (!plea || plea.length > 1000) {
                    e.preventDefault();
                  }
                }}
              >
                Plea
              </button>
            </div>

          </div>
            
          <ConfirmClose
            confirm={close}
            cancelBool={showConfirmClose}
            cancel={setShowConfirmClose}
            resetForm={reset}
          />
        </form>
      </div>
    </div>
  );
};

export default PleaForm;