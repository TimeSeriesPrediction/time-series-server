const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function() {

  const querySchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    message: {
        type: String,
        required: true
    }
  });

  return mongoose.model('Query', querySchema);
}