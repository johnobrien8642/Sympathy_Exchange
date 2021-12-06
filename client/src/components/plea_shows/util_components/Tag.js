import React from 'react';
import { useHistory } from 'react-router-dom';

const TagShow = ({
  tag
}) => {
  const history = useHistory();
  
  return (
    <button
      key={tag._id}
      className='tag'
      onClick={e => {
        e.preventDefault();

        history.push(`/tag-feed/${tag._id}`)
      }}
    >
      {tag.title}
    </button>
  )
};

export default TagShow;