const mongoose = require('mongoose');
const q = require('q');
const constants = require('../../constants');

module.exports = function({
  crypto
}){

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
      required: true
    }
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

