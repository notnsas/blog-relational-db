const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingList extends Model {}

ReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reading_list',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'blog_id']  // kombinasi keduanya harus unik
    }
  ]
})

ReadingList.prototype.toJSON = function() {
  const values = this.get()
  return {
    id: values.id,
    user_id: values.userId,
    blog_id: values.blogId,
    read: values.read,
  }
}

module.exports = ReadingList