import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import multers3 from 'multer-s3';
import path from 'path';

import aws from 'aws-sdk';
import ogs from 'open-graph-scraper';
import keys from '../../config/keys.js'

const Image = mongoose.model('Image')
const Audio = mongoose.model('Audio')
const Video = mongoose.model('Video')
const __dirname = path.resolve();
const router = express.Router();

var s3Client = new aws.S3({
  secretAccessKey: keys.secretAccessKey,
  accessKeyId: keys.accessKeyId,
  region: 'us-east-1'
})

var upload = multer({
  storage: multers3({
    s3: s3Client,
    bucket: keys.bucket,
    acl: 'private',
    contentType: multers3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() +
      '-' + file.fieldname + '-' +
      file.originalname.split(' ').join('-'))
    }
  })
})

router.post('/images', upload.any(), async (req, res, next) => {

  function createImg(f, i) {
    let img = new Image({
      src: 'https://d19o4ugsraxwa9.cloudfront.net/' + f.key,
      key: f.key,
      createdAt: Date.now(),
    })
    return img.save()
  }

  const promises = req.files.map((f, i) => createImg(f, i))

  Promise
    .all(promises)
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error posts/api/images: ${err}`)
    })
})

router.post('/audio', upload.any(), async (req, res, next) => {
  
  function createAudio(f) {
    if (f !== undefined) {
      let audio = new Audio({
        url: 'https://d19o4ugsraxwa9.cloudfront.net/' + f.key,
        key: f.key,
        createdAt: Date.now()
      })
      return audio.save()
    }
  }

  Promise
    .all([createAudio(req.files[0])])
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error on image post promise: ${err}`)
    })
})

router.post('/video', upload.any(), async (req, res, next) => {

  function createVideo(req) {
    if (req.files) {
      let video = new Video({
        url: 'https://d19o4ugsraxwa9.cloudfront.net/' + req.files[0].key,
        key: req.files[0].key,
        createdAt: Date.now()
      })
      return video.save()
    } else {
      let video = new Video({
        url: req.body.params.url,
        createdAt: Date.now()
      })
      return video.save()
    }
  }

  Promise
    .all([createVideo(req)])
    .then(data => res.send(data))
    .catch(err => {
      console.log(`Error on image post promise: ${err}`)
    })
})

router.post('/metadata', (req, res, next) => {
  const options = { url: req.body.params.url }
  ogs(options, (error, results, response) => {
    res.send(results)
  })
})

export default router;