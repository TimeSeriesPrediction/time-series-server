const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const q = require('q');
const constants = require('../../constants');

module.exports = function({
  crypto
}){

  //TODO: Add all other user properties (and update usersService to match)
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    permissions: {
        admin: { type: Schema.Types.Boolean, required: true },
        modules: [
            {
                moduleCode: { type: String, required: true},
                permission: { type: Number, required: true}
            }
        ]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  });

  userSchema.methods.verifyPassword = function(password) {
        var deferred = q.defer();
        let actualPassword = this.password;

        var salt =  actualPassword.substr(this.password.length - (constants.SALT_LENGTH * 2));

        crypto.hash(password, salt).then(function(hash){
          if (hash === actualPassword){
            deferred.resolve();
          }
          else{
            deferred.reject();
          }
        });

        return deferred.promise;
  };

  return mongoose.model('User', userSchema);

}

