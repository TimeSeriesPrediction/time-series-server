const express = require('express');
const router = express.Router();
const constants = require('../../constants');

module.exports = function UsersApi ({
    usersService,
    authentication,
    authorisation
}){

    /**
    * @api {get} /users/ Get all users
    * @apiName GetUsers
    * @apiGroup Users
    * @apiDescription Gets all users from database
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiSuccess {Object[]}  users Array of users
    * @apiSuccess {String}  users.username Username
    * @apiSuccess {String}  users.password Password
    * @apiSuccess {String}  users.email Email
    * @apiSuccess {String}  users.resetPasswordToken Password reset token
    * @apiSuccess {String}  users.resetPasswordExpires Password reset token expiry
    */
    router.get('/',authentication.authenticate, authorisation.adminOnly,  (req, res) => {
        
        usersService.getUsers()
        .then(function(users){
            res.data.users = users;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /**
    * @api {get} /users/profile Get current user
    * @apiName GetCurrentUser
    * @apiGroup Users
    * @apiDescription Gets the current user based on authentication token
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiSuccess {Object}  user Current user
    * @apiSuccess {String}  user.username Username
    * @apiSuccess {String}  user.password Password
    * @apiSuccess {String}  user.email Email
    * @apiSuccess {String}  user.resetPasswordToken Password reset token
    * @apiSuccess {String}  user.resetPasswordExpires Password reset token expiry
    */
    router.get('/profile',authentication.authenticate, (req, res) => {
        res.data.user = req.user;
        res.status(200).send(res.data);
    });

    /**
    * @api {get} /users/:id Get specific user
    * @apiName GetUser
    * @apiGroup Users
    * @apiDescription Gets a specific user by id
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} id Id of user to retrieve
    *
    * @apiSuccess {Object}  user Current user
    * @apiSuccess {String}  user.username Username
    * @apiSuccess {String}  user.password Password
    * @apiSuccess {String}  user.email Email
    * @apiSuccess {String}  user.resetPasswordToken Password reset token
    * @apiSuccess {String}  user.resetPasswordExpires Password reset token expiry
    */
    router.get('/:id',authentication.authenticate, authorisation.adminOnly, (req, res) => {
        usersService.getUserById(req.params.id)
        .then(function(user){
            res.data.user = user;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
    });

    /**
    * @api {post} /users/ Adds a user
    * @apiName PostUser
    * @apiGroup Users
    * @apiDescription Adds a user to the database
    *
    * @apiParam {String} username New user's username
    * @apiParam {String} password New user's password
    * @apiParam {String} email New user's email
    * @apiParma {Boolean} admin Is user admin
    * @apiParam {String} fullname New user's fullname
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "User created successfully"
    *     }
    */
    router.post('/',   (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var admin = req.body.admin;
        var fullName = req.body.fullname;

        usersService.addUser(username, password, email, fullName, admin)
        .then(function(){
            res.data.message = 'User created successfully';
            res.status(201).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    /**
    * @api {post} /users/add-users Add users
    * @apiName PostUsers
    * @apiGroup Users
    * @apiDescription Adds an array of users to the database
    *
    * @apiParam {Object[]} users An array of user objects
    * @apiParam {String} users.username New user's username
    * @apiParam {String} users.password New user's password
    * @apiParam {String} users.email New user's email
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Users created successfully"
    *     }
    */
    router.post('/add-users', authentication.authenticate, authorisation.adminOnly, (req, res) => {
        var users = req.body.users;

        usersService.addUsers(users)
        .then(function() {
            res.data.message = 'Users created successfully';
            res.status(201).send(res.data);
        })
        .catch(function(error) {
            res.status(500).send(error);
        });
    });

    return router;
} 