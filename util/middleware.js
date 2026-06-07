const { SECRET } = require('../util/config')

const jwt = require('jsonwebtoken')
const { Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      req.token = authorization.substring(7)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const sessionValidator = async (req, res, next) => {
  try {
    console.log('before session validation')
    const authorization = req.get('authorization')
    const session = await Session.findOne({
      where: {
        token: req.token,
        expired: false
      }
    })
    console.log('after session validation')
    console.log('session', session)

    if (!session) {
      return res.status(401).json({ error: 'session doesnt exist' })
    }

    if (session.expired) {
      return res.status(401).json({ error: 'session expired' })
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'session or token is invalid' })
  } 
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log("error", error.message)
  console.log("error name", error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'SequelizeValidationError' &&
    error.message.includes('username')
  ) {
    return response
      .status(400)
      .json({ error: 'username must be a valid email address' })
  } else if (error.name === 'SequelizeValidationError') {
    return response
      .status(400)
      .json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(404).json({ error: error.message })
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(404).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TypeError') {
    return response.status(404).json({ error: 'token missing or invalid' })
  } else if (error) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { tokenExtractor, sessionValidator, errorHandler }