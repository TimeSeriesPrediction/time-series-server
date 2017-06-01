const crypto = require('crypto-js');
const q = require('q');
const constants = require('../../constants');
const appSettings = require('../../config');

//TODO: Make this run asynchronously
module.exports = function(){
    return{
        encrypt: function(data){
            var ciphertext = crypto.AES.encrypt(data, appSettings.secret);
            return ciphertext.toString();
        },

        decrypt: function(data){
            var bytes = crypto.AES.decrypt(data, appSettings.secret);
            return bytes.toString(crypto.enc.Utf8);
        },

        getSalt: function(){
            var deferred = q.defer();

            deferred.resolve(crypto.lib.WordArray.random(constants.SALT_LENGTH).toString());

            return deferred.promise;
        },

        hash: function(data, salt){
            var deferred = q.defer();

            data = data + salt;

            var hash = crypto.MD5(data);
            hash = hash.toString() + salt;
            deferred.resolve(hash);

            return deferred.promise;
        }

    }
}