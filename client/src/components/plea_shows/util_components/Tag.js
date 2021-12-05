import React from 'react';

const TagShow = ({
  tag
}) => {
  
  return (
    <div
      className='tag'
      key={tag._id}
    >
      {tag.title}
    </div>
  )
};

export default TagShow;