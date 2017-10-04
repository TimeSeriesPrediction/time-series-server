const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../../constants');

module.exports = function() {

  const userViewModelSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    permissions: {
        admin: Schema.Types.Boolean,
        modules: [
            {
                moduleCode: { type: String, required: true},
                permission: { type: Number, required: true}
            }
        ]
    }

  });

  return mongoose.model('UserViewModel', userViewModelSchema);
}