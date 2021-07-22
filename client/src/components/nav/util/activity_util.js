import MentionActivityShow from './components/Mention_Activity_Show';
import RepostActivityShow from './components/Repost_Activity_Show';
import CommentActivityShow from './components/Comment_Activity_Show';
import FollowerActivityShow from './components/Follower_Activity_Show';
import LikeActivityShow from './components/Like_Activity_Show';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const handleActivity = (
  activity,
  tab,
  dropdown,
  active,
  setActive
) => {
  
  if (tab === 'all' || tab === undefined) {
    if (activity.kind === 'Mention') {
      return (
        <MentionActivityShow
          dropdown={dropdown}
          mention={activity}
          active={active}
          setActive={setActive}
        />
      )
    } else if (activity.kind === 'Repost') {
      return (   
        <RepostActivityShow
          dropdown={dropdown}
          repost={activity}
          active={active}
          setActive={setActive}
        />
      )
    } else if (activity.kind === 'Comment') {
      return (
        <CommentActivityShow 
          dropdown={dropdown}
          comment={activity}
          active={active}
          setActive={setActive}
        />
      )
    } else if (activity.kind === 'Follow') {
      return (
        <FollowerActivityShow
          dropdown={dropdown}
          follow={activity}
          active={active}
          setActive={setActive}
        />
      )
    } else if (activity.kind === 'Like') {
      return (
        <LikeActivityShow
          dropdown={dropdown}
          like={activity}
          active={active}
          setActive={setActive}
        />
      )
    }
  } else if (tab === 'Mention') {
    if (activity.kind === 'Mention') {
      return (
        <MentionActivityShow
          dropdown={dropdown}
          mention={activity}
          active={active}
          setActive={setActive}
        />
      )
    }
  } else if (tab === 'Repost') {
    if (activity.kind === 'Repost') {
      return (
        <RepostActivityShow
          dropdown={dropdown}
          repost={activity}
          active={active}
          setActive={setActive}
        />
      )
    }
  } else if (tab === 'Comment') {
    if (activity.kind === 'Comment') {
      return (
        <CommentActivityShow
          dropdown={dropdown} 
          comment={activity}
          active={active}
          setActive={setActive}
        />
      )
    }
  } else if (tab === 'Follow') {
    if (activity.kind === 'Follow') {
      return (
        <FollowerActivityShow
          dropdown={dropdown}
          follow={activity}
          active={active}
          setActive={setActive}
        />
      )
    }
  }
}

const handleTimeAgo = (activity, timeAgoRef, tab) => {
  var timeAgoString = timeAgo.format(new Date(parseInt(activity.createdAt)))

  if (
      !timeAgoRef.current.includes(timeAgoString) &&
      (tab === 'all' || tab === undefined)
    ) {
      timeAgoRef.current.push(timeAgoString)

      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Mention' && activity.kind === 'Mention'
    ) {
      timeAgoRef.current.push(timeAgoString)

      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Repost' && activity.kind === 'Repost'
    ) {
      timeAgoRef.current.push(timeAgoString)
      
      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    } else if (
      !timeAgoRef.current.includes(timeAgoString) &&
      tab === 'Comment' && activity.kind === 'Comment'
    ) {
      timeAgoRef.current.push(timeAgoString)
      
      return (
        <div
          className='timeAgo'
        >
          <p>{timeAgoString}</p>
        </div>
      )
    }
}

const handleByline = (activity) => {
  var post
  if (activity.kind === 'Repost') {
    post = activity.post
  } else {
    post = activity
  }

  var words, descriptionsArr = [], allDescriptions
  
  if (post.kind === 'TextPost') {
    if (post.title) {
      words = post.title.split(' ')
      var titleArr = []
      if (words.length > 10) {
        titleArr = words.slice(0, 10)

        return (
          <span className='byLine'>{titleArr.join(' ') + '...'}</span>
        )
      } else {
        titleArr = [...words]

        return (
          <span className='byLine'>{descriptionsArr.join(' ')}</span>
        )
      }
      
    } else if (post.descriptions) {
      allDescriptions = post.descriptions.map(d => d.content).join(' ')
      words = allDescriptions.split(' ')
      descriptionsArr = []
      if (words.length > 10) {
        descriptionsArr = words.slice(0, 10)

        return (
          <span className='byLine'>{descriptionsArr.join(' ') + '...'}</span>
        )
      } else {
        descriptionsArr = [...words]

        return (
          <span className='byLine'>{descriptionsArr.join(' ')}</span>
        )
      }
    } else {
      return (
        <span></span>
      )
    }
  } else if (
    post.kind === 'PhotoPost' ||
    post.kind === 'LinkPost' ||
    post.kind === 'AudioPost' ||
    post.kind === 'VideoPost'
  ) {
    if (post.descriptions) {
      allDescriptions = post.descriptions.map(d => d.content).join(' ')
      words = allDescriptions.split(' ')

      if (words.length > 10) {
        descriptionsArr = words.slice(0, 10)

        return (
          <span className='byLine'>{descriptionsArr.join(' ') + '...'}</span>
        )
      } else {
        descriptionsArr = [...words]

        return (
          <span className='byLine'>{descriptionsArr.join(' ')}</span>
        )
      }

    } else {
      return (
        <span></span>
      )
    }
  } else if (post.kind === 'QuotePost') {
    words = post.quote.split(' ')
    var quoteArr = []

    if (words.length > 10) {
      quoteArr = words.slice(0, 10)

      return (
        <span className='byLine'>{quoteArr.join(' ') + '...'}</span>
      )
    } else {
      quoteArr = [...words]

      return (
        <span className='byLine'>{descriptionsArr.join(' ')}</span>
      )
    }
  }
}

const ActivityUtil = { 
  handleByline,
  handleActivity,
  handleTimeAgo,
}

export default ActivityUtil;