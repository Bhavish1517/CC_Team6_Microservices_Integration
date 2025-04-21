const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.cjs');

const Tutorial = sequelize.define('Tutorial', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  videoUrl: DataTypes.STRING,
  modules: {
    type: DataTypes.JSON,
    defaultValue: [{
      title: '',
      content: '',
      questions: [{
        question: '',
        options: ['', ''],
        correctAnswer: ''
      }]
    }]
  },
  question: DataTypes.STRING,
  options: DataTypes.JSON,
  correctAnswer: DataTypes.STRING,
});

module.exports = Tutorial;
