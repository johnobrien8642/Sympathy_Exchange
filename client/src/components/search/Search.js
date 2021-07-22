import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import SearchDropDown from './resultTypes/SearchDropDown';

import Queries from '../../graphql/queries';
const { IS_LOGGED_IN } = Queries;

const Search = ({
  searchClose,
  closeSearch,
  activityOpen,
  setActivityOpen,
  detailsOpen,
  setDetailsOpen,
  searchOpen,
  openSearch,
  mobile,
  user
}) => {
  let [input, setInput] = useState('');
  let [followedActive, setFollowedActive] = useState(mobile ? true : false)
  let [active, setActive] = useState(false);
  
  useEffect(() => {
    if (searchClose) {
      //eslint-disable-next-line
      setFollowedActive(active = false)
      //eslint-disable-next-line
      closeSearch(searchClose = false)
    }
  }, [searchClose, mobile, searchOpen])

  const onBlur = (e) => {
    if (!e.relatedTarget) {
      if (mobile) {
        openSearch(searchOpen = false)
      } else {
        setActive(active = false)
        setFollowedActive(followedActive = false)
      }
    }
  }

  const { data } = useQuery(IS_LOGGED_IN);

  if (data.isLoggedIn) {
    return (
      <div
        className='searchBar'
        tabIndex='0'
        onBlur={e => onBlur(e)}
        onFocus={e => {
          if (
            !e.relatedTarget || 
            e.relatedTarget.localName === 'a'
          ) {
            setFollowedActive(followedActive = true)

            if (!mobile) {
              setActivityOpen(activityOpen = false)
              setDetailsOpen(detailsOpen = false)
            }
          }
        }}
      >
        <img
          className='searchIcon'
          src="https://img.icons8.com/material-rounded/24/000000/search.png"
          alt=''
          style={{opacity: .3}}
        />
        <input
          className='searchBarInput'
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onClick={() => {
            var el = document.querySelector('.searchIcon')
            el.style.opacity = '1'
            if (!mobile) {
              setDetailsOpen(detailsOpen = false)
              setActivityOpen(activityOpen = false)
            }
          }}
          onBlur={() => {
            var el = document.querySelector('.searchIcon')
            el.style.opacity = '.3'
          }}
          onChange={e => {
              if (e.target.value === "") {
                setInput(input = e.target.value)
                setFollowedActive(followedActive = true)
              } else {
                setInput(input = e.target.value)
                setFollowedActive(followedActive = false)
                setActive(active = true)
              }
          }}
        />

        <SearchDropDown
          user={user}
          input={input}
          followedActive={followedActive}
          active={active}
          setActive={setActive}
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
          src="https://img.icons8.com/material-rounded/24/000000/search.png"
          alt=''
          style={{opacity: .3}}
        />
        <input
          className='searchBarInput'
          type='text'
          value={input}
          placeholder={'Search Rumblr'}
          onClick={() => {
            var el = document.querySelector('.searchIcon')
            el.style.opacity = '1'
          }}
          onBlur={() => {
            var el = document.querySelector('.searchIcon')
            el.style.opacity = '.3'
          }}
          onChange={e => setInput(input = e.target.value)}
        />
      </div>
    )
  }

}

export default Search;