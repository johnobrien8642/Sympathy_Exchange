import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import SearchDropDown from './SearchDropDown';
import Queries from '../../graphql/queries.js';
const { CURRENT_USER_ID } = Queries;

const Search = ({
  user,
  mobile,
  searchClose,
  closeSearch,
  searchRef,
  setActivityOpen,
  setDetailsOpen,
  openSearch,
}) => {
  let [input, setInput] = useState('');
  let [followedActive, setFollowedActive] = useState(!!mobile)
  let [active, setActive] = useState(false);
  let searchIconImgRef = useRef(null);

  let { data } = useQuery(CURRENT_USER_ID);
  
  useEffect(() => {
    if (searchClose) {
      //eslint-disable-next-line
      setFollowedActive(false)
      //eslint-disable-next-line
      closeSearch(false)
    }
  }, [searchClose, setFollowedActive, closeSearch])

  const onBlur = (e) => {
    if (!e.relatedTarget) {
      if (mobile) {
        openSearch(false)
      } else {
        setActive(false)
        setFollowedActive(false)
      }
    }
  }


  if (user) {
    return (
      <div
        className='searchBar'
        tabIndex='0'
        ref={searchRef}
        onBlur={e => onBlur(e)}
        onFocus={e => {
          if (
            !e.relatedTarget || 
            e.relatedTarget.localName === 'a'
          ) {
            setFollowedActive(true);    
          }
        }}
      >
        <img
          className='searchIcon'
          alt='sympathy man icon'
          src='./assets/search_icon.png'
          style={{opacity: .3}}
          ref={searchIconImgRef}
        />
        <input
          className='searchBarInput'
          type='text'
          value={input}
          placeholder={'How are you suffering?'}
          onClick={() => {
            searchIconImgRef.current.style.opacity = '1'
          }}
          onBlur={() => {
            searchIconImgRef.current.style.opacity = '.3'
          }}
          onChange={e => {
              if (e.target.value === "") {
                setInput(e.target.value);
                setFollowedActive(true);
              } else {
                setInput(e.target.value);
                setFollowedActive(false);
                setActive(true);
              };
          }}
        />

        <SearchDropDown
          user={user}
          input={input}
          followedActive={followedActive}
          active={active}
          setActive={setActive}
          currentUserId={data ? data.currentUserId : null}
        />
      </div>
    )
  } else {
    return (
      <div
        className='searchBar'
      >
        <img
          className='searchIcon'
          alt='sympathy man icon'
          src='./assets/search_icon.png'
          style={{opacity: .3}}
          ref={searchIconImgRef}
        />
        <input
          className='searchBarInput'
          type='text'
          value={input}
          placeholder={'How are you suffering?'}
          onClick={() => {
            searchIconImgRef.current.style.opacity = '1'
          }}
          onBlur={() => {
            searchIconImgRef.current.style.opacity = '.3'
          }}
          onChange={e => setInput(e.target.value)}
        />
      </div>
    )
  }

}

export default Search;