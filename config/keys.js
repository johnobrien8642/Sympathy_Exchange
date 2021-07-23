// import keys_prod from './keys_prod'
// import keys_dev from './keys_dev.js'

// export default process.env.NODE_ENV === 'development' ? keys_dev : keys_prod;

export default {
  secretOrKey: process.env.SECRET_OR_KEY,
  emailAuthToken: process.env.EMAIL_AUTH_TOKEN,
  hostEmail: process.env.HOST_EMAIL,
  hostPassword: process.env.HOST_PASSWORD,
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/sympathy-exchange-db'
}
