import React from 'react';

import TagResult from '../search/resultTypes/Tag_Result';

const RecommendedTags = ({
  recTags
}) => {

  const handleClassNameWithColor = () => {
    var colors = ['blue', 'green', 'orange']

    return `recommendedTags ${colors[Math.floor(Math.random() * 3)]}`
  }

  return (
    <div
      className='recommendedTagsContainer'
    >
      {recTags.map(tag => {
        return (
          <div
            className={handleClassNameWithColor()}
            key={tag._id}
          >
            <TagResult tag={tag} />
            <span>{}</span>
          </div>
        )
      })}
    </div>
  )
}

export default RecommendedTags;