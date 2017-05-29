const q = require('q');

module.exports = function({
    userModel
}) {
    return {

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

        addUser: function(name){
            var deferred = q.defer();

            let user = new userModel({
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
}