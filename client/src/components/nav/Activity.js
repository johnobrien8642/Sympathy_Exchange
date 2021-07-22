import React, { useState, useRef, useEffect } from 'react';

import Tabs from './Tabs';
import Content from './Content';

const Activity = ({
  navActive, setNavActive, 
  activityClose, 
  activityOpen,
  setActivityOpen
}) => {
  let timeAgoRef = useRef([]);
  let cursorId = useRef(new Date().getTime());
  let [active, setActive] = useState(false);
  let [tab, setTab] = useState('all');

  useEffect(() => {
    var el = document.querySelector('.activity')

    if (el) {
      el.focus()
    }

  }, [activityClose, activityOpen, active])
  
  if (activityOpen) {

    return (
      <div
        className='activity'
        tabIndex={0}
        onBlur={e => {
          if (!e.relatedTarget) {
            setActivityOpen(activityOpen = false)
          }
        }}
      >
        <Tabs
          tab={tab}
          setTab={setTab}
          cursorId={cursorId}
          timeAgoRef={timeAgoRef}
        />
        <Content
          tab={tab}
          active={active}
          setActive={setActive}
          activityCursorId={cursorId}
          navActive={navActive}
          setNavActive={setNavActive}
          timeAgoRef={timeAgoRef}
        />
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default Activity;