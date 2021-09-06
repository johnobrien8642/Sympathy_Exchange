import React from 'react';
import TagShow from './util_components/Tag_Show';
import AuthorAndSQ from './util_components/AuthorAndSQ';

const NonChained = ({
  plea
}) => {
  
  return (
    <div
      className='plea'
    >
      <div
        className='textAndSQContainer'
      >
        <div
          className='text'
        >
          {plea.text}
        </div>

        <AuthorAndSQ plea={plea} />
      </div>

      <div
        className='pleaTags'
      >
        {plea.tagIds.map(tag => {
          return (
            <React.Fragment
              key={tag._id}
            >
              <TagShow tag={tag} />
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
};

export default NonChained;