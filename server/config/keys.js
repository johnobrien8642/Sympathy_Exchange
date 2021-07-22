// import keys_prod from './keys_prod.js'
// import keys_dev from './keys_dev.js'

// export default process.env.NODE_ENV === 'development' ? keys_dev : keys_prod;

export default {
  localIP: process.env.LOCAL_IP,
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/sympathy-exchange-db'
}
