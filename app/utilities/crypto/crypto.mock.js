const q = require('q');

module.exports = function(){
    return{
        encrypt: function(data){
            return "*encrypted=" + data + "=encrypted*";
        },

        decrypt: function(data){
            return data.split('=')[1];
        },

        getSalt: function(){
            var deferred = q.defer();

            deferred.resolve("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456");

            return deferred.promise;
        },

        hash: function(data, salt){
            var deferred = q.defer();

            data = data + salt;

            var hash = "hash (" + data + ")";
            hash = hash + salt;
            deferred.resolve(hash);

            return deferred.promise;
        },

        generateResetToken: function(){
            var deferred = q.defer();

            deferred.resolve("abcdefghijklmnopqrst");

            return deferred.promise;
        }

    }
}