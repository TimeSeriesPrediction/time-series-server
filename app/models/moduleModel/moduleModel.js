const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function(){

  const moduleSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      unique: true,
      index: true,
      required: true,
      uppercase: true
    },
    HOD: { type: Schema.Types.ObjectId, ref: 'Users'}, 
    enrollments: Schema.Types.Mixed,
    assessments: Schema.Types.Mixed
  });

  return mongoose.model('Module', moduleSchema);

}