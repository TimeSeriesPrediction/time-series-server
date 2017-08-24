const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function() {

  const assessmentMarkSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessments' },
    questionResults: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: 'Questions' },
            mark: { type: Number, required: true }
        }
    ],
    finalResult: { type: Number }
  });

  return mongoose.model('AssessmentMark', assessmentMarkSchema);
}