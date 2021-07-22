import app from './server/server.js'

const port = process.env.PORT || 5000

app.listen({ port: port }, () => console.log(`Server listening on port ${port}`))
