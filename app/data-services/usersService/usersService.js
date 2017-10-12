const q = require('q');
const bluebird = require('bluebird');
const NotFoundException = require('../../models/exceptions/NotFoundException');

module.exports = function({
    userModel,
    UserViewModel,
    crypto
}) {
    return {
        getAuthenticatedUser: function(username, password){
            var deferred = q.defer();

            userModel.findOne({username: username}, (err, user) => {
                if (user) {
                    user.verifyPassword(password).then(function(){
                        var userViewModel = new UserViewModel({
                            username: user.username,
                            fullname: user.fullname,
                            email: user.email,
                            permissions: user.permissions
                        });

                        deferred.resolve(userViewModel);
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

        addUser: function(username, password, email, fullName, admin){
            var deferred = q.defer();

            crypto.getSalt().then(function(salt){
                crypto.hash(password, salt).then(function(hash){
                    let user = new userModel({
                        username: username,
                        password: hash,
                        email: email,
                        fullname: fullName,
                        permissions: {
                            admin: admin,
                            modules: []
                        }
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
        },

        //TODO: Currently it adds users until one user gives an error and then all the rest fails. 
        //It needs to do some validation and add as many users as possible even when one errors, then give feedback on which users weren't added
        addUsers: function(usersToAdd){
            let deferred = q.defer();

            let userPromises = [];
            let users = [];

            for(var i = 0; i < usersToAdd.length; i++){
                let userToAdd = usersToAdd[i];
                let internalDeferred = q.defer();

                crypto.getSalt().then(function(salt){
                    crypto.hash(userToAdd.password, salt).then(function(hash){
                        let user = new userModel({
                            username: userToAdd.username,
                            password: hash,
                            fullname: userToAdd.fullname,
                            email: userToAdd.email,
                            permissions: {
                                admin: false,
                                modules: []
                            }
                        });

                        if (user.validate()){
                            users.push(user);
                        }

                        internalDeferred.resolve();
                    });
                });

                userPromises.push(internalDeferred);
            }

            bluebird.all(userPromises).then(() => {
                userModel.collection.insertMany(users, (err) => {
                    if(err){
                        deferred.reject(err);
                    }
                    deferred.resolve();
                });
            });

            return deferred.promise;
        }

    }
}