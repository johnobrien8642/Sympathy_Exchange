import React from 'react';

const TagShow = ({
  tag
}) => {
  
  return (
    <div
      className='tag'
      key={tag._id}
    >
      This is a tag
    </div>
  )
};

export default TagShow;