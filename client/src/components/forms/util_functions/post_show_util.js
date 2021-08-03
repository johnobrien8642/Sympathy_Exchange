import React from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import ReactPlayer from 'react-player';
import UserResult from '../../../search/resultTypes/User_Result';
import ProfilePic from '../../../user/util/components/Profile_Pic';
import FollowButton from '../../../posts/util/components/social/Follow_Button';

const postHeader = (
  post, 
  discover, 
  radar,
  doesUserFollowUserRef,
  repostFormBool
) => {
  if (post.kind === 'Repost') {
    return (
      <div
        className='userRepostHeader'
      >
        <span>
          <ProfilePic
            user={post.post.user}
          />
          <Link
            to={`/view/blog/${post.post.user.blogName}`}
          >
            {post.post.user.blogName}
          </Link>
        </span>
      </div>
    )
  } else if (discover || radar) {
    return (
      <div
        className='postRadarPostHeader discoverPostHeader'
      >
        <UserResult user={post.user} />
      </div>
    )
  } else if (repostFormBool) {
    return (
      <span
        className='repostHeaderExtraProPic'
      >
        <ProfilePic
          user={post.user}
          standaloneLink={true}
        />

        <div
          className='profilePicAndLinkContainer'
        >
          <ProfilePic 
            user={post.user}
          />

          <Link
            to={`/view/blog/${post.user.blogName}`}
          >
            {post.user.blogName}
          </Link>
        </div>
      </span>
    )
  } else {
    return (
      <span
        className='userPostHeader'
      >
        <ProfilePic
          user={post.user}
          standaloneLink={true}
        />

        <Link
          to={`/view/blog/${post.user.blogName}`}
        >
          {post.user.blogName}
        </Link>

        <FollowButton
          feed={true}
          user={post.user}
          followed={doesUserFollowUserRef.current}
        />
      </span>
    )
  }
}

const repostFooter = (post, update, repostCaption, setRepostCaption) => {
  let repost = post

  if (post.kind === 'Repost') {
    return (
      <ul
      className='repostItemList'
      >
        {repost.repostTrail.map((obj, i) => {
          return (
            <li
              className='repostShowItem'
              key={i}
            >
              <span>
                <ProfilePic 
                  user={obj.user}
                  activity={{ kind: 'Repost' }}
                />
                <Link to={`/view/blog/${obj.user.blogName}`}>
                  {obj.user.blogName}
                </Link>
              </span>

              <div
                className='repostCaptionDiv'
                contentEditable={
                  update && i === repost.repostTrail.length - 1 ?
                  true : false
                }
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(obj.caption)
                }}
                onInput={e => {
                  setRepostCaption(repostCaption = e.target.innerHTML)
                }}
              />
            </li>
          )
        })}
      </ul>
    )
  }
}

const postTags = (post) => {
  var data = demeterPost(post)
  
  return (
  <div
    className='postTags'
  >
    {data.tagIds.map((tag, i) => {
      var cleanedTitle = tag.title.slice(1)
      return (
        <div
         key={tag._id}
         className='tag'
        >
          <Link 
            to={`/view/tag/${cleanedTitle}`}
          >
            {tag.title}
          </Link>
        </div>
      )
    })}
    </div>
  )
}

const postBody = (post) => {
  var data = demeterPost(post)
  var descriptionArr = [...data.descriptionImages]
  
  data.descriptions.forEach((obj, i) => {
    descriptionArr.splice(obj.displayIdx, 0, obj)
  })
  
  if (data.kind === 'TextPost') {
    return (
      <React.Fragment>
        <h3
          className='textPostTitle'
        >
          {data.title}
        </h3>
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )

  } else if (data.kind === 'PhotoPost') {
    return (
      <React.Fragment>
        <div
          className='mainImageContainer'
        >
          {data.mainImages.map((mainImg, i) => {
            return (
              <img
                className='mainImage'
                key={i} 
                src={`${mainImg.src}`} 
                alt={'usefilename'} 
              />
            )
          })}
        </div>
        <p>{data.description}</p>
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )

  } else if (data.kind === 'QuotePost') {
    
    return (
      <React.Fragment>
        <h1
          className='quote'
        >{data.quote}</h1>
        
        <p
          className='source'
        >
          {data.source}
        </p>
          {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'LinkPost') {
    return (
      <React.Fragment>
        <div
          className='linkContainer'
        >
          <a href={data.linkObj.link}>
            <div
              className='imgContainer'
            >
              <div className='imgModal'/>
              <img
                className='siteImage'
                src={data.linkObj.imageUrl}  
                alt={'link page img'}
              />
              <h2
                className='siteTitle'
              >{data.linkObj.title}</h2>
            </div>
            <p
              className='siteDescription'
            >{data.linkObj.linkDescription}</p>
            <span
              className='siteName'
            >{data.linkObj.siteName}</span>
          </a>
        </div>
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'ChatPost') {
    return (
      <React.Fragment>
        <div
          className='chatDiv'
          dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.chat)}}
        />
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'AudioPost') {
    return (
      <React.Fragment>
      <div
        className='audioPlayerContainer'
      >
        <div
          className='audioDataContainer'
        >
          <p
            className='title'
          >{data.audioMeta.title}</p>
          <p
            className='artist'
          >{data.audioMeta.artist}</p>
          <p
            className='album'
          >{data.audioMeta.album}</p>
        </div>
        <AudioPlayer
          src={data.audioFile.url}
        />
      </div>
      {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  } else if (data.kind === 'VideoPost') {
    return (
      <React.Fragment>
        <ReactPlayer
          width={'100%'}
          height={'100%'}
          url={data.videoLink.url}
          controls
        />
        {displayDescription(descriptionArr)}
      </React.Fragment>
    )
  }
}

const demeterPost = (post) => {
  if (post.kind === 'Like' && post.post.kind === 'Repost') {
    return post.post.post
  } else if (post.kind === 'Like' || post.kind === 'Repost') {
    return post.post
  } else {
    return post
  }
}

const displayDescription = (descriptionArr) => {
  return (
    <div
      className='descriptionTextAndImage'
    >
      {descriptionArr.map((obj, i) => {
        switch(obj.kind) {
          case 'text':
            return (
              <div
                className='descriptionText'
                key={obj._id}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj.content) }}
              />
            )
          case 'Image':
            return (
              <div
                className='descriptionImgContainer'
                key={obj._id}
              >
                <img 
                  className='descriptionImg' 
                  src={`${obj.src}`} 
                  alt={'usefilename'} 
                />
              </div>
            )
          default:
            return 'no keys matched postBody PhotoPost'
        }
      })}
    </div>
  )
}

const handlePostClassName = (obj) => {
  var demeterPost 

  if (obj.kind === 'Like') {
    demeterPost = obj.post
  } else {
    demeterPost = obj
  }
  
  var { kind } = demeterPost;

  if (kind === 'TextPost') {
    return 'post textPost'
  } else if (kind === 'PhotoPost') {
    return 'post photoPost'
  } else if (kind === 'QuotePost') {
    return 'post quotePost'
  } else if (kind === 'LinkPost') {
    return 'post linkPost'
  } else if (kind === 'ChatPost') {
    return 'post chatPost'
  } else if (kind === 'AudioPost') {
    return 'post audioPost'
  } else if (kind === 'VideoPost') {
    return 'post videoPost'
  } else if (kind === 'Repost') {
    if (demeterPost.post.kind === 'TextPost') {
      return 'post repost textPost'
    } else if (demeterPost.post.kind === 'PhotoPost') {
      return 'post repost photoPost'
    } else if (demeterPost.post.kind === 'QuotePost') {
      return 'post repost quotePost'
    } else if (demeterPost.post.kind === 'LinkPost') {
      return 'post repost linkPost'
    } else if (demeterPost.post.kind === 'ChatPost') {
      return 'post repost chatPost'
    } else if (demeterPost.post.kind === 'AudioPost') {
      return 'post repost audioPost'
    } else if (demeterPost.post.kind === 'VideoPost') {
      return 'post repost videoPost'
    }
  }
}

const handleDemeterActivityPost = (activity) => {
  if (activity.post.kind === 'Repost') {
    return activity.post.post
  } else {
    return activity.post
  }
}


const PostShowUtil = { 
  postHeader, 
  postBody, 
  repostFooter,
  postTags,
  handlePostClassName,
  handleDemeterActivityPost
}

export default PostShowUtil;