const router = require('express').Router()

const bcrypt = require('bcrypt')

const { tokenExtractor } = require('../util/middleware')
const { User } = require('../models')
const { Blog } = require('../models')

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

  const user = await User.create({
    username,
    name,
    passwordHash
  })

  response.status(201).json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, async (req, res, next) => {
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