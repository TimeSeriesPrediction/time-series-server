const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    ]
  });

  return mongoose.model('Assessment', assessmentSchema);
}