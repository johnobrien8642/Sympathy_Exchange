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
  
  // let { loading, error, data } = useQuery(FETCH_MAX_PARAMETER_FOR_FILTER);

  // if (loading) return 'Loading...';
  // if (error) return `Error in Sympathy Count Filter Params: ${error.message}`;

  // const { fetchMaxParameterForFilter } = data;
  // const { integerLength, ceiling, ceiling2 } = fetchMaxParameterForFilter;
  
  // let filterParamsArr = ['All'],
  // zeroes = '0'.repeat(integerLength - 1);
    
  // if (ceiling !== 1) {
  //   filterParamsArr.push(`0-1${'0'.repeat(integerLength - 1)}`)
  //   for (var i = 1; i < ceiling; i++) {
  //     let str = i.toString() + zeroes;
  //     filterParamsArr.push(str)
  //   };
  // };

  // filter.rangeArr.push('0');
  // if (ceiling2) {
  //   filter.rangeArr.push(ceiling2.toString());
  // };
  
  return (
    <div
      className='sympathyCountFilterParamsContainer'
    >
      {/* {filterParamsArr.map((str, i) => {
        return (
          <div
            className={selectedIndex.current === i ? 'sympathyCountParam selected' : 'sympathyCountParam'}
            key={i}
            onClick={() => {
              if (selectedIndex.current !== i) {
                if (str === 'All') {
                  selectedIndex.current = i;
                  lastPleaSympathyCountRef.current = null;
                  fetchMoreBoolRef.current = true;
  
                  setFilter({
                    floor: null,
                    ceiling: null,
                    tagIdArr: filter.tagIdArr,
                    bySympCount: false,
                    byTagIds: filter.byTagIds
                  });
                } else {
                  selectedIndex.current = i;
                  lastPleaSympathyCountRef.current = null;
                  fetchMoreBoolRef.current = true;
  
                  setFilter({
                    floor: parseInt(str),
                    ceiling: parseInt(
                      str.split('')[0] +
                      '9'.repeat(fetchMaxParameterForFilter.integerLength - 1)
                      ),
                      tagIdArr: filter.tagIdArr,
                      bySympCount: true,
                      byTagIds: filter.byTagIds
                  });
                }
              } else {
                lastPleaSympathyCountRef.current = null;
                fetchMoreBoolRef.current = true;
              }
            }}
          >
            {str === 'All' ? str : `${str}s`}
          </div>
        )
      })} */}

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
