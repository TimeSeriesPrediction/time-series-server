const q = require('q');
const User = require('../models/user');

module.exports = {
    getUsers: function(){
        var deferred = q.defer();

        User.find({}, (err, users) => {
            if (err){
                deferred.reject(err);
            }

            deferred.resolve(users);
        });

        return deferred.promise;
    },

    getUserById: function(id){
        var deferred = q.defer();

        User.findById(id, (err, users) => {
            if (err) {
                deferred.reject(err)
            }

            deferred.resolve(users);
        });

        return deferred.promise;
    },

    addUser: function(name){
        var deferred = q.defer();

        let user = new User({
            name: name
        });

        user.save(error => {
            if (error) {
                deferred.reject(error);
            }

            deferred.resolve();
        });

        return deferred.promise;
    }
}