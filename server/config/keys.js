// import keys_prod from './keys_prod.js'
// import keys_dev from './keys_dev.js'

export default {
  localIP: process.env.LOCAL_IP,
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/sympathy-exchange-db',
  secretKeyForRecoveryPhrase: process.env.SECRET_KEY_FOR_RECOVERY_PHRASE,
  secretOrKey: process.env.SECRET_OR_KEY
}
