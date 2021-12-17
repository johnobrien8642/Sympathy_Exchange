import 'dotenv/config';
import app from './server/server.js';

const port = process.env.PORT || 4000
app.listen({ port: port }, () => console.log(`Server listening on port ${port}`))
