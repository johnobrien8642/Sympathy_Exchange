import React from 'react';
import Tag from './Tag';

const Tags = ({
  tags
}) => {

  return (
    <div
      className='pleaTags'
    >
      {tags.map(tag => {
        return (
          <React.Fragment
            key={tag._id}
          >
            <Tag tag={tag} />
          </React.Fragment>
        )
      })}
    </div>
  )
};

export default Tags;