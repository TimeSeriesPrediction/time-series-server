const express = require('express');
const router = express.Router();

module.exports = function UsersApi ({
    usersService,
    authentication
}){

    /* GET all users. */
    router.get('/',authentication.authenticate,  (req, res) => {
        
        usersService.getUsers()
        .then(function(users){
            res.status(200).json(users);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    //For testing authentication - REMOVE
    router.get('/profile',authentication.authenticate, (req, res) => {
        res.status(200).json(req.user);
    });

    /* GET one users. */
    router.get('/:id', (req, res) => {
        usersService.getUserById(req.params.id)
        .then(function(user){
            res.status(200).json(user);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
    });

    /* Create a user. */
    router.post('/', (req, res) => {
        var name = req.body.username;
        var password = req.body.password;
        var email = req.body.email;

        usersService.addUser(name, password, email)
        .then(function(){
            res.status(201).json({
                message: 'User created successfully'
            });
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    return router;
} 