import mongoose from 'mongoose';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import path from 'path';
import models from './models/index.js';
import keys from './config/keys.js'
import schema from './schema/schema.js';
import cors from 'cors';
global.__dirname = path.resolve('./')
const app = express();

mongoose
.connect(keys.mongoURL, { 
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 1000,
  bufferMaxEntries: 0,
  bufferCommands: false
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.log(err))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}
  
app.use(express.json({ limit: '50mb' }))
app.use(cors({ credentials: true, origin: true }));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

export default app;

