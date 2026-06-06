require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

const getBlogs = async () => {
  console.log('Executing (default): SELECT * FROM blogs');
  const blogs = await Blog.findAll();
  blogs.forEach(blog => {
    console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`);
  });
}

getBlogs()



// app.post('/api/notes', async (req, res) => {
//   try {
//     const note = await Note.create({...req.body, date: new Date()})
//     return res.json(note)
//   } catch(error) {
//     return res.status(400).json({ error })
//   }
// })