import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import keys from '../../../config/keys.js';
const User = mongoose.model('User');

router.post('/send-auth', function(req,res, next) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: keys.hostEmail,
        pass: keys.hostPassword
      }
    })

    const mailOptions = {
      from: `${keys.hostEmail}`,
      to: `${req.body.email}`,
      subject: `${req.body.name}`,
      text: `${req.body.message}`,
      replyTo: `${req.body.email}`,
      html: `${req.body.html}`
    }

    transporter.sendMail(mailOptions, function(err, res) {
      if(err) {
        console.log(`Error: ${err}`)
      }
    })
})

router.get('/activate', async function(req, res, next) {
    let user = await User.findOne({ emailAuthToken: req.query.authenticationToken })
    
    if (user) {
      user.authenticated = true;
      user.emailAuthToken = undefined;
      user.lastUpdated = Date.now()
      user.save().then(() => res.redirect('http://localhost:3000/#/welcome'))
    } else {
      throw new Error('Authentication failed')
    }
})

export default router;