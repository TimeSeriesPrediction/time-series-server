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
    deadline: {
      type: Date,
      required: true
    },
    link: String,
    marks: [
      {
        username: {
           type: Schema.Types.ObjectId, 
           ref: 'Users.username'
        },
        mark: {
          type: Number
        }
      }
    ]
  });

  return mongoose.model('Assessment', assessmentSchema);
}