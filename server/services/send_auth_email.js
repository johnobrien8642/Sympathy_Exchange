import axios from 'axios';

const sendAuthEmail = user => {

  var mailData = {};
    mailData.email = user.email
    mailData.name = "Welcome to Rumblr!"
    mailData.subject = "Welcome to Rumblr, a clone of Tumblr"
    mailData.text = "Click the link below to authenticate your account"
    mailData.html = `<div><h1>Welcome to Rumblr, a Tumblr clone!</h1><p>Please click the link below to authenticate your account.</p><a href='http://localhost:5000/api/mailer/activate?authenticationToken=${user.emailAuthToken}'>Activate</a></div>`

    
  return axios.post('http://localhost:5000/api/mailer/send-auth', mailData)
    .catch(err => {
    console.log(err.response.message)
  })
}

export default sendAuthEmail;