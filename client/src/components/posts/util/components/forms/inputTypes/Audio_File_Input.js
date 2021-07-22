import React, { useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import * as mm from 'music-metadata-browser';
import PostFormUtil from '../../../functions/post_form_util.js'
const { previewAudio, removeAudioObj } = PostFormUtil;

const AudioFileInput = ({
  displayBodyImageAndTextInput,
  setDisplayBodyImageAndTextInput,
  post, 
  update, 
  audioFile,
  setAudioFile,
  title, 
  setTitle, 
  artist, 
  setArtist, 
  album,
  setAlbum,
  src,
  setSrc,
  audioObj, setAudioObj, 
  active, setActive,
  objsToClean
}) => {

  useEffect(() => {
    if (post) {
      //eslint-disable-next-line
      setTitle(title = post.audioMeta.title)
      //eslint-disable-next-line
      setArtist(artist = post.audioMeta.artist) 
      //eslint-disable-next-line
      setAlbum(album = post.audioMeta.album) 
      //eslint-disable-next-line
      setSrc(src = post.audioFile.url) 
      //eslint-disable-next-line
      setActive(active = true)
    }

    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (audioFile || src) {
      //eslint-disable-next-line
      setDisplayBodyImageAndTextInput(displayBodyImageAndTextInput = true)
    }

  }, [setDisplayBodyImageAndTextInput, displayBodyImageAndTextInput])

  const renderUpdateFileInput = () => {
    if (update) {
      return (
        // <div>
        <label
          className='audioFileInputCustomLabel'
        >
          <div>
            <img 
              src="https://img.icons8.com/nolan/64/headphones.png"
              alt=''
            />
            <span>Upload a different audio file</span>
          </div>
          <input
            id='audioFileInput'
            type='file'
            accept='.mp3, .mp4, .wav, .aiff'
            onChange={e => {
              previewAudio(
                e,
                mm,
                audioFile,
                setAudioFile,
                title, 
                setTitle, 
                artist,
                setArtist, 
                album,
                setAlbum,
                src,
                setSrc,
                active,
                setActive,
                objsToClean,
                post,
              )

              document.getElementById('audioFileInput').value = ''
            }}
          />
        </label>
        // </div>
      )
    }
  }

  if (active) {
    return (
      <div
        className='audioFilePlayer'
      >
        <button
          className='removeBtn'
          type='button'
          disabled={update ? true : false}
          onClick={() =>  {
            removeAudioObj(
              post,
              audioObj,
              setAudioObj,
              audioFile,
              setAudioFile,
              active, 
              setActive,
              objsToClean
            )
          }}
        >
          X
        </button>
        <p>Title:
          <input 
            type='text'
            value={title}
            onChange={e => {
              setTitle(title = e.target.value)
            }}
          /> 
        </p>
        <p>Artist: 
          <input 
            type='text'
            value={artist}
            onChange={e => {
              setArtist(artist = e.target.value) 
            }}
          />
        </p>
        <p>Album: 
          <input 
            type='text'
            value={album}
            onChange={e => {
              setAlbum(album = e.target.value) 
            }}
          />
        </p>
        <AudioPlayer
          src={src}
        />
        {renderUpdateFileInput()}
      </div>
    )
  } else {
    return(
      <label
        className='audioFileInputCustomLabel'
      >
        <div>
          <img 
            src="https://img.icons8.com/nolan/64/headphones.png"
            alt=''
          />
          <span>Upload an audio file</span>
        </div>
        <input
          id='audioFileInput'
          type='file'
          accept='.mp3, .mp4, .wav, .aiff'
          onChange={e => {
            previewAudio(
              e,
              mm,
              audioFile,
              setAudioFile,
              title, 
              setTitle, 
              artist,
              setArtist, 
              album,
              setAlbum,
              src,
              setSrc,
              active,
              setActive,
              objsToClean,
              post,
            )
            document.getElementById('audioFileInput').value = ''
          }}
        />
      </label>
    )
  }
}

export default AudioFileInput;