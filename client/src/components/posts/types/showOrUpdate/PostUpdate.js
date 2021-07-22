import React from 'react';

import TextPostForm from '../create/TextPostForm';
import PhotoPostForm from '../create/PhotoPostForm';
import QuotePostForm from '../create/QuotePostForm';
import LinkPostForm from '../create/LinkPostForm';
import ChatPostForm from '../create/ChatPostForm';
import AudioPostForm from '../create/AudioPostForm';
import VideoPostForm from '../create/VideoPostForm';
import RepostForm from '../../util/components/social/Repost_Form';

const PostUpdate = ({ 
  post, 
  update,
  setUpdate,
  toggleUpdate,
  uploading,
  setUploading
}) => {
  
  const renderForm = (post) => {
    if (post.kind === 'Repost') {
      return (
        <RepostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'TextPost') {
      return (
        <TextPostForm
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )

    } else if (post.kind === 'PhotoPost') {
      return (
        <PhotoPostForm 
          post={post} 
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'QuotePost') {
      return (
        <QuotePostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'LinkPost') {
      return (
        <LinkPostForm
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'ChatPost') {
      return (
        <ChatPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'AudioPost') {
      return (
        <AudioPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    } else if (post.kind === 'VideoPost') {
      return (
        <VideoPostForm 
          post={post}
          update={update}
          setUpdate={setUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )
    }
  }

  return (
    renderForm(post)
  )
}

export default PostUpdate;