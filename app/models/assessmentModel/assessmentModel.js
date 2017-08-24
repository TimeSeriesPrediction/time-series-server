const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = require('../questionModel/questionModel');

module.exports = function(){

  const assessmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    type: {
        type: String,
        required: true,
        enum:  ['Exam', 'Test', 'Assignment', 'Practical']
    },
    questions: [
        questionSchema
    ]
  });

  return mongoose.model('Assessment', assessmentSchema);
}