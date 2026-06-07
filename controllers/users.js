const router = require('express').Router()

const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const { tokenExtractor, sessionValidator } = require('../util/middleware')
const { User, Blog, ReadingList } = require('../models')
// const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({ 
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(passwordHash)
  const user = await User.create({
    username,
    name,
    passwordHash
  })

  response.status(201).json(user)
})

router.get('/:id', async (req, res) => {
  let read = { [Op.in]: [true, false] }  

  if ( req.query.read ) {
    read = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
  include: [
      {
        model: Blog,
        as: 'readings',  // sesuaikan dengan alias di belongsToMany
        attributes: { exclude: ['userId'] },
        through: {
          model: ReadingList,
          as: 'reading_list',
          attributes: ['id', 'read'],  // hanya ambil id & read dari join table
          where: {
            read
          }
        },
      },
    ],
  })

  // if (user.readings.length === 0) {
  //   return res.status(200).json([])
  // }
  console.log('User readings:', user.readings.length)

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
// router.get('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id)
//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

router.put('/:username', tokenExtractor, sessionValidator, async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
    user.username = req.body.username
    await user.save()
    res.json(user)
  } catch(error) {
    next(error)
  }
})

module.exports = router