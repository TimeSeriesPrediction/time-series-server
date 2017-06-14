const crypto = require('crypto-js');
const uid = require('rand-token').uid;
const q = require('q');
const config = require('config');
const constants = require('../../constants');

//TODO: Make this run asynchronously
module.exports = function(){
    return{
        encrypt: function(data){
            var ciphertext = crypto.AES.encrypt(data, config.get('secret'));
            return ciphertext.toString();
        },

        decrypt: function(data){
            var bytes = crypto.AES.decrypt(data, config.get('secret'));
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
        },
        
        generateResetToken: function(){
            var deferred = q.defer();

            deferred.resolve(uid(20)); // Generate 20 string random hex base token

            return deferred.promise;
        }

    }
}