
const QueryFragments = {
  POST:`
    user {
      _id
      username
      kind
    }
    allText
    descriptions
    descriptionImages {
      _id
      src
      key
      kind
      displayIdx
    }
    tagIds {
      _id
      title
    }
    tagTitles
    createdAt
    kind
  `,
  PHOTO_POST:`
    _id
    mainImages {
      _id
      src
      key
      kind
    }
  `,
  TEXT_POST:`
    _id
    title
    main
  `,
  QUOTE_POST:`
    _id
    quote
    source
  `,
  LINK_POST:`
    _id
    linkObj
  `,
  CHAT_POST:`
    _id
    chat
  `,
  AUDIO_POST:`
    _id
    audioFile {
      _id
      url
      key
      kind
    }
    audioMeta
  `,
  VIDEO_POST:`
    _id
    videoLink {
      _id
      url
      key
      kind
    }
  `,
}

export default QueryFragments;