const q = require('q');
const User = require('../models/user');

module.exports = {
    getUsers: function(){
        var deferred = q.defer();

        deferred.resolve([
            new User({
                "_id": "5926f3085a76f4000f627ba9",
                "name": "Jim",
                "__v": 0
            }),
            new User({
                "_id": "5926f30b5a76f4000f627baa",
                "name": "Sarah",
                "__v": 0
            })
        ]);

        return deferred.promise;
    },

    getUserById: function(id){
        var deferred = q.defer();

        deferred.resolve(new User({
                "_id": "5926f3085a76f4000f627ba9",
                "name": "Jim",
                "__v": 0
            })
        );

        return deferred.promise;
    },

    addUser: function(name){
        var deferred = q.defer();

        deferred.resolve();

        return deferred.promise;
    }
}