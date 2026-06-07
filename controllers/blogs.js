const router = require('express').Router()

const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')
const { tokenExtractor, sessionValidator } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search
          }
        },
        {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
      order: [['likes', 'DESC'],],
    where
  })

  res.json(blogs)
})

// router.get('/', async (req, res) => {
//   const blogs = await Blog.findAll({
//     attributes: { exclude: ['userId'] },
//     include: {
//       model: User,
//       attributes: ['name']
//     }
//   })
//   res.json(blogs)
// })

router.post('/', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    console.log('req.body', req.body)
    const blog = await Blog.create({...req.body, userId: user.id, year: req.body.year ? req.body.year : null})
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

// router.post('/', tokenExtractor, sessionValidator, async (req, res, next) => {
//   try {
//     const blog = await Blog.create({... req.body, date: new Date()})
//     res.json(blog)
//   } catch(error) {
//     // return res.status(400).json({ error })
//     next(error)
//   }
// })

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    next(error)
  }
  
})

router.delete('/:id', tokenExtractor, sessionValidator, blogFinder, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.id !== req.blog.userId) {
      return res.status(405).json({ error: "You're not the user that make this blog" })
    }

    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router