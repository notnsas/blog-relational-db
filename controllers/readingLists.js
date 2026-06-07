const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')
const { tokenExtractor, sessionValidator } = require('../util/middleware')

router.get('/', async (req, res) => {
  const entries = await ReadingList.findAll()
  res.json(entries)
})
// router.get('/', async (req, res) => {
//   let where = {}

//   if (req.query.search) {
//     where = {
//       [Op.or]: [
//         {
//           title: {
//             [Op.substring]: req.query.search
//           }
//         },
//         {
//           author: {
//             [Op.substring]: req.query.search
//           }
//         }
//       ]
//     }
//   }

//   const blogs = await Blog.findAll({
//     attributes: { exclude: ['userId'] },
//     include: {
//       model: User,
//       attributes: ['name']
//     },
//       order: [['likes', 'DESC'],],
//     where
//   })

//   res.json(blogs)
// })

router.post('/', async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id)
    console.log('req.body', req.body)
    const blog = await ReadingList.create({ ...req.body })
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    console.log('req.body', req.body)
    
    const readingList = await ReadingList.findByPk(req.params.id)
    
    if (user.id !== readingList.userId) {
      return res.status(401).json({ error: "You're not the user that make this reading list" })
    }

    readingList.read = req.body.read

    readingList.save()
    res.json(readingList)
  } catch(error) {
    next(error)
  }
})

console.log('run')

module.exports = router