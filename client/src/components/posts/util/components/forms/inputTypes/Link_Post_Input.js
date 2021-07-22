import React from 'react';

const LinkPostInput = ({
  link, setLink
}) => {
  
  if (link) {
    return (
      <div></div>
    )
  } else {
    return (
      <div>
        <textarea
            value={link}
            placeholder='Type or paste a URL'
            onChange={e => {
                setLink(link = e.target.value)
              }
            }
        ></textarea>
      </div>
    )
  }
}

export default LinkPostInput;