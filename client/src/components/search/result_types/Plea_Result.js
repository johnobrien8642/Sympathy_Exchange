import React from 'react';
import { Link } from 'react-router-dom';

const PleaResult = ({ 
  currentUserId, 
  plea, 
  active, 
  setActive 
}) => {

  function truncateText() {
    if (plea.text.length > 50) {
      let pleaWords = plea.text.split(' ');
      let sliced = pleaWords.slice(0, 25);
      sliced[0].replace(/\W/gm, '')
      let text = sliced.join(' ');
      return (
        <div
          className='text truncated'
        >
          {text + '...'}
        </div>
      )
    } else {
      let pleaWords = plea.text.split(' ');
      pleaWords[0].replace(/\W/gm, '')
      let text = pleaWords.join(' ');
      return (
        <div
          className='text'
        >
          {text}
        </div>
      )
    }
  }
  
  return (
    <React.Fragment>
    <Link
        to={`/plea/${plea._id}`}
        onClick={() => {
          if (active) {
            setActive(active = false)
          }
        }}
      >
        {truncateText()}
      </Link>
    </React.Fragment>
  )
}

export default PleaResult;