const q = require('q');

module.exports = function({
    userModel,
    crypto
}) {
    return {

        getAuthenticatedUser: function(username, password){
            var deferred = q.defer();

            userModel.findOne({username: username}, (err, user) => {
                if (user){
                    user.verifyPassword(password).then(function(){
                        deferred.resolve(user);
                    })
                    .catch(function(){
                        deferred.reject();
                    });
                    
                }
                else{
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        getUsers: function(){
            var deferred = q.defer();

            userModel.find({}, (err, users) => {
                if (err){
                    deferred.reject(err);
                }

                deferred.resolve(users);
            });

            return deferred.promise;
        },

        getUserById: function(id){
            var deferred = q.defer();

            userModel.findById(id, (err, users) => {
                if (err) {
                    deferred.reject(err)
                }

                deferred.resolve(users);
            });

            return deferred.promise;
        },

        addUser: function(username, password){
            var deferred = q.defer();

            crypto.getSalt().then(function(salt){
                crypto.hash(password, salt).then(function(hash){
                    let user = new userModel({
                        username: username,
                        password: hash
                    });

                    user.save(error => {
                        if (error) {
                            deferred.reject(error);
                        }

                        deferred.resolve();
                    });
                });
            });

            return deferred.promise;
        }

    }
}