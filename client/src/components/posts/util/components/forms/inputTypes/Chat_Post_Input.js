import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

const ChatPostInput = ({
  post, 
  chat, 
  setChat
}) => {
  let [placeholder, setPlaceholder] = useState("<strong>Brother Muzone:</strong> Well we can't stand out here all night...<br><br><strong> Omar Little:</strong> I suppose we can't...<br><br><strong> Brother Muzone:</strong> A man has to have a code.<br><br><strong> Omar Little:</strong> Oh indeed...")

  useEffect(() => {
    if (post) {
      document.querySelector('.chatText').innerHTML = post.chat
    }

    var firstSpace = document.createTextNode(' ')
    var chatDiv = document.querySelector('.chatText')
    chatDiv.appendChild(firstSpace)
    //eslint-disable-next-line
  }, [])

  const regexChat = () => {
    var chatDiv = document.querySelector('.chatText')
    
    const bolded = chatDiv.innerText
    .replace(/^(.*?:)/gm, '<strong>$1</strong>')
    .split('\n').join('<br/>')
    
    chatDiv.innerHTML = bolded
    
    if (window.getSelection) {
      var range = document.createRange();
      range.selectNodeContents(chatDiv)
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  
  return (
    <div
      className={!placeholder ? 'chatText' : 'chatText placeholder'}
      contentEditable={true}
      onInput={e => {
        regexChat()
        
        setChat(chat = e.target.innerHTML)
      }}
      onFocus={() => {
        setPlaceholder(placeholder = '')
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          if (window.getSelection) {
            var selection = window.getSelection(),
            range = selection.getRangeAt(0),
            br = document.createElement('br'),
            br2 = document.createElement('br'),
            suffixNode
            range.deleteContents();
            range.insertNode(br);
            range.collapse(false)
            range.insertNode(br2);
            range.setEndAfter(br2);
            range.collapse(false);
            range.insertNode((suffixNode = document.createTextNode(' ')));
            range.collapse(true)
            range.setStartAfter(suffixNode);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post ? post.chat : placeholder) }}
    >
    </div>
  )
}

export default ChatPostInput;