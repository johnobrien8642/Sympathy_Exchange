import React, { useEffect } from 'react';
import ReactSlider from 'react-slider';

const SympathyCountFilterParams = ({
  filter,
  setFilter,
  initSliderVal,
  lastPleaSympathyCountRef,
  objectIdRef,
  fetchMoreBoolRef
}) => {
  
  useEffect(() => {
    let newObj = {...filter};
    newObj.rangeArr = initSliderVal;
    setFilter(newObj)
    //eslint-disable-next-line
  }, [])
  
  return (
    <div
      className='sympathy-count-filter-params-container'
    >
      <ReactSlider
        value={filter.rangeArr}
        max={initSliderVal[initSliderVal.length - 1]}
        onChange={(value, index) => {
          let newObj = {...filter};
          newObj.rangeArr = value;
          newObj.bySympCount = true;
          lastPleaSympathyCountRef.current = null;
          fetchMoreBoolRef.current = true;
          setFilter(newObj)
        }}
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        renderThumb={(props, state) => <div {...props}><span className='value'>{state.valueNow}</span></div>}
      />
    </div>
  )
};

export default SympathyCountFilterParams;
