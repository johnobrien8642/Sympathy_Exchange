import React from 'react';

const SearchInput = ({
  setSearchInput,
  inputRef
}) => {

  return (
    <>
      <input
        className='plea-search-input'
        ref={inputRef}
        onInput={e => {
          setTimeout(() => {
            setSearchInput(e.target.value)
          }, 500)
        }}
      />
    </>
  )
};

export default SearchInput;