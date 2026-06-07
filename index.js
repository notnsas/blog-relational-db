const express = require('express')
const middleware = require('./util/middleware')
const app = express()

const { Blog, User, ReadingList, Session } = require('./models')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { tokenExtractor } = require('./util/middleware')
const { sequelize } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const readingListsRouter = require('./controllers/readingLists')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

console.log('router load')

app.use('/api/blogs', blogsRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.delete('/api/logout', tokenExtractor, async (req, res) => {
  const token = req.token
  if (!token) {
    return res.status(401).json({ error: 'Token missing' })
  }

  await Session.destroy({ where: { token } })
  res.status(204).end()
})
app.post('/api/reset', async (req, res) => {
  await ReadingList.destroy({ where: {} })
  await Session.destroy({ where: {} })
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })

  // reset sequences
  await sequelize.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
  await sequelize.query('ALTER SEQUENCE blogs_id_seq RESTART WITH 1')
  await sequelize.query('ALTER SEQUENCE sessions_id_seq RESTART WITH 1')
  await sequelize.query('ALTER SEQUENCE reading_lists_id_seq RESTART WITH 1')

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