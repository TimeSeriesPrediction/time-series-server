const mongoose = require('mongoose');
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

  userSchema.methods.validate = function() {
    return !isNullOrWhiteSpace(this.username) &&
      !isNullOrWhiteSpace(this.password) && 
      !isNullOrWhiteSpace(this.email);
  }

  function isNullOrWhiteSpace(input){
     if (typeof input === 'undefined' || input == null) return true;

     return input.replace(/\s/g, '').length < 1;
  }

  return mongoose.model('User', userSchema);

}

