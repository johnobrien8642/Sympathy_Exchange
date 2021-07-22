import React, { useEffect, useState } from 'react';
import Validator from 'validator';

import LinkNameAndImage from '../forms/Link_Name_And_Image'
import LinkTitleAndDesc from '../forms/Link_Title_And_Desc'

const LinkPreview = ({
  displayBodyImageAndTextInput,
  setDisplayBodyImageAndTextInput,
  post, 
  link, 
  setLink, 
  result,
  siteName, 
  setSiteName,
  imageUrl, 
  setImageUrl, 
  setTitle,
  title, 
  linkDescription,
  setLinkDescription, 
  resetLink
}) => {
  let [input, setInput] = useState('');
  let [showNameAndUrl, setShowNameAndUrl] = useState(true)
  let [showTitleAndLinkDescription, 
        setShowTitleAndLinkDescription] = useState(true)

  useEffect(() => {
    
    if (post) {
      const { linkObj } = post;
      //eslint-disable-next-line
      setLink(link = linkObj.link)
      //eslint-disable-next-line
      setSiteName(siteName = linkObj.siteName)
      //eslint-disable-next-line
      setImageUrl(imageUrl = linkObj.imageUrl)
      //eslint-disable-next-line
      setTitle(title = linkObj.title)
      //eslint-disable-next-line
      setLinkDescription(linkDescription = linkObj.linkDescription)
      //eslint-disable-next-line
      setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = true)
    }

    //eslint-disable-next-line
  }, [])
  
  
  useEffect(() => {

    const resetInput = () => {
      //eslint-disable-next-line
      setShowNameAndUrl(showNameAndUrl = true)
      //eslint-disable-next-line
      setShowTitleAndLinkDescription(showTitleAndLinkDescription = true)
      //eslint-disable-next-line
      setInput(input = '')
    }

    if (!showNameAndUrl && !showTitleAndLinkDescription) {
      //eslint-disable-next-line
      resetLink()
      //eslint-disable-next-line
      resetInput()
    }
  }, [showNameAndUrl, showTitleAndLinkDescription, resetLink])

  useEffect(() => {
    if (result) {
      //eslint-disable-next-line
      setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = true)
    }
  }, [result])

 

  if (result) {
    return (
      <div
        className='linkPreviewContainer'
      >
        <LinkNameAndImage
          link={link}
          showNameAndUrl={showNameAndUrl}
          setShowNameAndUrl={setShowNameAndUrl}
          siteName={siteName}
          setSiteName={setSiteName}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
  
        <LinkTitleAndDesc
          link={link}
          showTitleAndLinkDescription={showTitleAndLinkDescription}
          setShowTitleAndLinkDescription={setShowTitleAndLinkDescription}
          title={title}
          setTitle={setTitle}
          linkDescription={linkDescription}
          setLinkDescription={setLinkDescription}
        />
      </div>
    )
  } else {
    return(
      <div
        className='urlInputContainer'
      >
        <textarea
            className='urlInput'
            value={input}
            placeholder='Type or paste a URL'
            onChange={e => {
                setInput(input = e.target.value)
                if (Validator.isURL(input)) {
                  setLink(link = input)
                }
              }
            }
        ></textarea>
      </div>
    )
  }
}

export default LinkPreview;