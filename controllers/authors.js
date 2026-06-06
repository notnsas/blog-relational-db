const router = require('express').Router()

const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res, next) => {
  try {
    const blog = await Blog.findAll({ 
      attributes: { exclude: ['userId'] },
      attributes: ['author', [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'], [sequelize.fn('SUM', sequelize.col('likes')), 'likes']],
      order: [['likes', 'DESC'],],
      group: 'author'
     });
    res.json(blog)
  } catch(error) {
    next(error)
  }
})


module.exports = router