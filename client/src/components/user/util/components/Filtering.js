import React from 'react';

import FilterTagInput from './Filter_Tag_Input';
import FilterPostContentInput from './Filter_Post_Content_Input';

const Filtering = ({
  mobile,
  user
}) => {

  return (
    <div
      className='filteringContainer'
    >
      <h3>Filtered Tags</h3>
      <FilterTagInput user={user} mobile={mobile} />
      <h3>Filtered Post Content</h3>
      <FilterPostContentInput user={user} mobile={mobile} />
    </div>
  )
}

export default Filtering;