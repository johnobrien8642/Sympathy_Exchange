import React from 'react';
import Tags from './util_components/Tags';
import AuthorAndSQ from './util_components/Author_And_SQ';

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
        {plea.pleaIdChain.map(plea => {
          <div className='inner'>
            <div
            className='text'
            >
              {plea.text}
            </div>
            <AuthorAndSQ plea={plea} />
          </div>
        })}
      </div>

      <Tags tags={plea.tagIds} />
    </div>
  )
};

export default NonChained;