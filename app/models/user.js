const mongoose = require('mongoose');

// create the mongoose schema
const userSchema = new mongoose.Schema({
  name: String
});

// create mongoose model
module.exports = mongoose.model('User', userSchema);