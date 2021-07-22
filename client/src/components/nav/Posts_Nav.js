import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import PhotoPostForm from '../posts/types/create/PhotoPostForm';
import TextPostForm from '../posts/types/create/TextPostForm';
import QuotePostForm from '../posts/types/create/QuotePostForm';
import LinkPostForm from '../posts/types/create/LinkPostForm';
import ChatPostForm from '../posts/types/create/ChatPostForm';
import AudioPostForm from '../posts/types/create/AudioPostForm';
import VideoPostForm from '../posts/types/create/VideoPostForm';
import ProfilePic from '../user/util/components/Profile_Pic';

import PostFormUtil from '../posts/util/functions/post_form_util.js'
const { preventScroll, allowScroll } = PostFormUtil;

const PostsNav = ({
  user,
  userLikes,
  mobile,
  uploading,
  setUploading
}) => {
  let [postFormOpen, setPostFormOpen] = useState(false);
  let [textPostActive, setTextPostActive] = useState(false);
  let [photoPostActive, setPhotoPostActive] = useState(false);
  let [quotePostActive, setQuotePostActive] = useState(false);
  let [linkPostActive, setLinkPostActive] = useState(false);
  let [chatPostActive, setChatPostActive] = useState(false);
  let [audioPostActive, setAudioPostActive] = useState(false);
  let [videoPostActive, setVideoPostActive] = useState(false);
  let [postFormModal, setPostFormModal] = useState(false);
  let [open, setOpen] = useState(false);
  let history = useHistory();

  let iconUrls = {
    photo: { 
      browser: "https://img.icons8.com/fluent/64/000000/old-time-camera.png",
      mobile: "https://img.icons8.com/ios-glyphs/64/000000/camera.png"
    },
    quote: {
      browser: "https://img.icons8.com/fluent/64/000000/quote-left.png",
      mobile: "https://img.icons8.com/fluent-systems-filled/64/000000/quote-left.png"
    },
    link: {
      browser: "https://img.icons8.com/flat-round/64/000000/link--v1.png",
      mobile: "https://img.icons8.com/metro/64/000000/link.png"
    },
    chat: {
      browser: "https://img.icons8.com/officel/64/000000/speech-bubble-with-dots.png",
      mobile: "https://img.icons8.com/fluent-systems-filled/64/000000/speech-bubble-with-dots.png"
    },
    audio: {
      browser: "https://img.icons8.com/nolan/64/headphones.png",
      mobile: "https://img.icons8.com/fluent-systems-filled/64/000000/headphones.png"
    },
    video: {
      browser: "https://img.icons8.com/nolan/64/camcorder-pro.png",
      mobile: "https://img.icons8.com/material-rounded/64/000000/camcorder-pro.png"
    }
  }
  
  useEffect(() => {
    if (mobile) {
      var el = document.querySelector('.mobilePostsNav.open')
      
      if (el) {
        el.focus()
      }

      preventScroll(open, document)
    }

    return () => {
      allowScroll(document)
    }
  })
  
  if (mobile) {
    setTimeout(() => {
      setOpen(open = true)
    }, 100)
  }
  
  const handleMobilePostsNavModalClass = (uploading, mobile, open) => {
    if (uploading) {
      return 'mobilePostsNavModal hidden'
    } else if (mobile && !open) {
      return 'mobilePostsNavModal'
    } else if (mobile && open) {
      return 'mobilePostsNavModal open'
    }
  }
  
  const handleMobileOrBrowserPostsNavClass = (uploading, mobile, open) => {
    if (uploading && mobile && postFormOpen) {
      return 'mobilePostsNav hidden'
    } else if (mobile && open && postFormOpen)  {
      return 'mobilePostsNav open postFormOpen'
    } else if (mobile && open) {
      return 'mobilePostsNav open'
    }else if (mobile && !open) {
      return 'mobilePostsNav'
    } else {
      return 'browserPostsNav'
    }
  }

  if (!userLikes) {
    if (mobile) {
      return (
        <div
          className={handleMobilePostsNavModalClass(uploading, mobile, open)}
        >
          <div
            className={handleMobileOrBrowserPostsNavClass(uploading, mobile, open)}
            tabIndex={-1}
            onBlur={() => {
              if (mobile && !postFormOpen) {
                Promise.all([
                  setOpen(open = false)
                ]).then(() => {
                  setTimeout(() => {
                    allowScroll(document)
                    history.push('/dashboard')
                  }, 100)
                })
              }
            }}
          >
            <div
              className='text postIconContainer'
              onClick={() => {
                setTextPostActive(textPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src="https://img.icons8.com/ios-filled/64/000000/sentence-case.png"
                  alt=''
                />
                <span>Text</span>
              </div>
            </div>
            
            <div
              className='photo postIconContainer'
              onClick={() => {
                setPhotoPostActive(photoPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.photo.mobile : iconUrls.photo.browser}
                  alt=''
                />
                <span>Photo</span>
              </div>
            </div>
            
            <div
              className='quote postIconContainer'
              onClick={() => {
                setQuotePostActive(quotePostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.quote.mobile : iconUrls.quote.browser}
                  alt=''
                />
                <span>Quote</span>
              </div>
            </div>
            
            <div
              className='link postIconContainer'
              onClick={() => {
                setLinkPostActive(linkPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.link.mobile : iconUrls.link.browser}
                  alt=''
                />
                <span>Link</span>
              </div>
            </div>
            
            <div
              className='chat postIconContainer' 
              onClick={() => {
                setChatPostActive(chatPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.chat.mobile : iconUrls.chat.browser}
                  alt=''
                />
                <span>Chat</span>
              </div>
            </div>
            
            <div
              className='audio postIconContainer'
              onClick={() => {
                setAudioPostActive(audioPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.audio.mobile : iconUrls.audio.browser}
                  alt=''
                />
                <span>Audio</span>
              </div>
            </div>
            
            <div
              className='video postIconContainer'
              onClick={() => {
                setVideoPostActive(videoPostActive = true)
                setPostFormModal(postFormModal = true)
                setPostFormOpen(postFormOpen = true)
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.video.mobile : iconUrls.video.browser}
                  alt=''
                />
                <span>Video</span>
              </div>
            </div>
          </div>
  
          <div
            className={postFormModal ?
              'postFormModal active' : 
              'postFormModal hidden'
            }
          >
            <TextPostForm
              user={user}
              mobile={true}
              textPostActive={textPostActive}
              setTextPostActive={setTextPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <PhotoPostForm
              user={user}
              mobile={true}
              photoPostActive={photoPostActive}
              setPhotoPostActive={setPhotoPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <QuotePostForm
              user={user}
              mobile={true}
              quotePostActive={quotePostActive}
              setQuotePostActive={setQuotePostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <LinkPostForm
              user={user}
              mobile={true}
              linkPostActive={linkPostActive}
              setLinkPostActive={setLinkPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <ChatPostForm
              user={user}
              mobile={true}
              chatPostActive={chatPostActive}
              setChatPostActive={setChatPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <AudioPostForm
              user={user}
              mobile={true}
              audioPostActive={audioPostActive}
              setAudioPostActive={setAudioPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
            <VideoPostForm
              user={user}
              mobile={true}
              videoPostActive={videoPostActive}
              setVideoPostActive={setVideoPostActive}
              postFormModal={postFormModal}
              setPostFormModal={setPostFormModal}
              postFormOpen={postFormOpen}
              setPostFormOpen={setPostFormOpen}
              uploading={uploading}
              setUploading={setUploading}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div
          className='browserPostsNavContainer'
        >
        
        <ProfilePic user={user} standaloneLink={true} />
  
          <div
            className={handleMobileOrBrowserPostsNavClass(mobile, open)}
            tabIndex={-1}
            onBlur={() => {
              if (mobile) {
                Promise.all([
                  setOpen(open = false)
                ]).then(() => {
                  setTimeout(() => {
                    history.push('/dashboard')
                  }, 100)
                })
              }
            }}
          >
  
            <div
              className='text postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setTextPostActive(textPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src="https://img.icons8.com/ios-filled/64/000000/sentence-case.png"
                  alt=''
                />
                <span>Text</span>
              </div>
            </div>
            
            <div
              className='photo postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setPhotoPostActive(photoPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.photo.mobile : iconUrls.photo.browser}
                  alt=''
                />
                <span>Photo</span>
              </div>
            </div>
            
            <div
              className='quote postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setQuotePostActive(quotePostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.quote.mobile : iconUrls.quote.browser}
                  alt=''
                />
                <span>Quote</span>
              </div>
            </div>
            
            <div
              className='link postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setLinkPostActive(linkPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.link.mobile : iconUrls.link.browser}
                  alt=''
                />
                <span>Link</span>
              </div>
            </div>
            
            <div
              className='chat postIconContainer' 
              onClick={() => {
                if (!uploading) {
                  setChatPostActive(chatPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.chat.mobile : iconUrls.chat.browser}
                  alt=''
                />
                <span>Chat</span>
              </div>
            </div>
            
            <div
              className='audio postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setAudioPostActive(audioPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.audio.mobile : iconUrls.audio.browser}
                  alt=''
                />
                <span>Audio</span>
              </div>
            </div>
            
            <div
              className='video postIconContainer'
              onClick={() => {
                if (!uploading) {
                  setVideoPostActive(videoPostActive = true)
                  setPostFormModal(postFormModal = true)
                }
              }}
            >
              <div>
                <img
                  className='postIcon'
                  src={mobile ? iconUrls.video.mobile : iconUrls.video.browser}
                  alt=''
                />
                <span>Video</span>
              </div>
            </div>
  
            <div
              className={postFormModal ?
                'postFormModal active' :
                'postFormModal hidden'
              }
            >
              <TextPostForm
                user={user}
                textPostActive={textPostActive}
                setTextPostActive={setTextPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <PhotoPostForm
                user={user}
                photoPostActive={photoPostActive}
                setPhotoPostActive={setPhotoPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <QuotePostForm
                user={user}
                quotePostActive={quotePostActive}
                setQuotePostActive={setQuotePostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <LinkPostForm
                user={user}
                linkPostActive={linkPostActive}
                setLinkPostActive={setLinkPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <ChatPostForm
                user={user}
                chatPostActive={chatPostActive}
                setChatPostActive={setChatPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <AudioPostForm
                user={user}
                audioPostActive={audioPostActive}
                setAudioPostActive={setAudioPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
              <VideoPostForm
                user={user}
                videoPostActive={videoPostActive}
                setVideoPostActive={setVideoPostActive}
                postFormModal={postFormModal}
                setPostFormModal={setPostFormModal}
                uploading={uploading}
                setUploading={setUploading}
              />
            </div>
          </div>
        </div>
      )
    }
  } else {
    return (
      <div>
      </div>
    )
  }
}

export default PostsNav;