const express = require('express');
const router = express.Router();

module.exports = function UsersApi ({
    usersService
}){
    /* GET api listing. */
    router.get('/', (req, res) => {
        res.send('api works');
    });

    /* GET all users. */
    router.get('/users', (req, res) => {
        usersService.getUsers()
        .then(function(users){
            res.status(200).json(users);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /* GET one users. */
    router.get('/users/:id', (req, res) => {
        usersService.getUserById(req.params.id)
        .then(function(user){
            res.status(200).json(user);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
    });

    /* Create a user. */
    router.post('/users', (req, res) => {
        var name = req.body.name;

        usersService.addUser(name)
        .then(function(){
            res.status(201).json({
                message: 'User created successfully'
            });
        })
        .catch(function(){
            res.status(500).send(error);
        });
    });

    return router;
} 