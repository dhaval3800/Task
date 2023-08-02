const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
// const Post = require('./post');
require('dotenv').config();

const sequelize = new Sequelize('task', process.env.USER_NAME, process.env.USER_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { 
        msg: 'Username cannot be empty'
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Email cannot be empty'
      },
      isEmail: {
        msg: 'Invalid email format'
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty'
      },
      len: {
        args: [4, 10],
        msg: 'Password must be between 4 and 10 characters long'
      },
    },
  },
},
  {
    hooks: {
      beforeValidate: (user) => {
        if (typeof user.username === 'string') {
          user.username = user.username.trim();
          user.password = user.password.trim();
          user.email = user.email.trim().toLowerCase();
        }
      },
      beforeCreate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      },
    },
  },
);

User.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.password; 
  return values;
}

// User.hasMany(Post, { foreignKey: 'userId' });

User.sync()
  .then(() => {
    console.log('User table has been successfully created, if not exist')
  })
  .catch(error => {
    console.log('This error occured', error)
  });

module.exports = User; 


