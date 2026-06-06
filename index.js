const express = require('express')
const middleware = require('./util/middleware')
const app = express()


const { Blog, User } = require('./models')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.post('/api/reset', async (req, res) => {
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })
  res.status(204).end()
})
app.get('/', async (req, res) => {
  res.status(200).end()
})

app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()