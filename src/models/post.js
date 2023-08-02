const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user');
require('dotenv').config();

const sequelize = new Sequelize('task', process.env.USER_NAME, process.env.USER_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Content cannot be empty'
      },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}
);

Post.belongsTo(User, { foreignKey: 'userId' }); 

Post.sync()
  .then(() => {
    console.log('User table has been successfully created, if one did not exist')
  })
  .catch(error => {
    console.log('This error occured', error)
  });

module.exports = Post;
