const q = require('q');
const NotFoundException = require('../../models/exceptions/NotFoundException');

module.exports = function({
    userModel,
    crypto
}) {
    return {

        getAuthenticatedUser: function(userId, password){
            var deferred = q.defer();

            userModel.findOne({userId: userId}, (err, user) => {
                if (user) {
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

        setNewPassword: function(token, password){
            var deferred = q.defer();

            userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (user) {
                    crypto.getSalt().then(function(salt){
                        crypto.hash(password, salt).then(function(hash){
                            user.password = hash;
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            user.save();
                            deferred.resolve();
                        })
                    });
                }
                else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        generatePasswordResetToken: function(email){
            var deferred = q.defer();

            userModel.findOne({ email: email }, function(err, user) {
                if (user) {
                    // TODO: Cater for ensuring each token is unique
                    crypto.generateResetToken()
                    .then(function(token) {
                        if (token) {
                            user.resetPasswordToken = token;
                        }
                        else {
                            deferred.reject();
                        }
                    })
                    .catch(function() {
                        deferred.reject();
                    })
                    .then(function() {
                        user.resetPasswordExpires = new Date().getTime() + (1*60*60*1000);
                        user.save();
                        deferred.resolve(user.resetPasswordToken);
                    });    
                }
                else {
                    deferred.reject(new NotFoundException('Email not found'));
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

            userModel.findOne({userId: id}, (err, users) => {
                if (err) {
                    deferred.reject(err)
                }

                deferred.resolve(users);
            });

            return deferred.promise;
        },

        addUser: function(userId, password, email){
            var deferred = q.defer();

            crypto.getSalt().then(function(salt){
                crypto.hash(password, salt).then(function(hash){
                    let user = new userModel({
                        userId: userId,
                        password: hash,
                        email: email
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