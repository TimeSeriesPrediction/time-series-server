const express = require('express');
const router = express.Router();

module.exports = function AccountApi({
    emailService,
    usersService,
    authentication
}){

    router.get('/reset/:token', function(req, res) {    
        var token = req.params.token;

        usersService.getValidResetToken(token)
        .then(function(){
            res.status(200).json({ message: 'token accepted'});
        })
        .catch(function(){
            res.status(401).json({ message: 'password reset is invalid or expired'});
        });
    });

    router.post('/token', function(req, res){
        var username = req.body.username;
        var password = req.body.password;

        if (!username || !password){
            res.status(401).json({ message: 'authorisation has been denied for this request'});
            return;
        }
    
        usersService.getAuthenticatedUser(username, password)
        .then(function(user){
            if (user){
                var ip = req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;

                authentication.generateAuthToken(user, ip).then(function(token){
                    res.status(200).json({
                        authToken: token
                    });
                });
            }
        })
        .catch(function(){
            res.status(401).json({ message: 'authorisation has been denied for this request'});
        });

    });

    router.post('/forgot', (req, res) => { 
        var email = req.body.email;
        var exists, token;

        usersService.addResetToken(email)
        .then(function(value){
            exists = true;
            token = value;
        })
        .catch(function(){
            exists = false;
        })
        .then(function(){
            emailService.sendForgottenPassword(email, exists, token)
            .then(function(){
                res.status(200).json({ message: 'an email was sent to ' + email });
            })
            .catch(function(error){
                res.status(500).send(error);
            });
        });
        
    });

    router.post('/reset', function(req, res) {    
        var token = req.body.token;
        var password = req.body.password;
        
        usersService.setNewPassword(token, password)
        .then(function(){
            res.status(200).json({ message: 'your password was successfully changed' });
        })
        .catch(function(){
            res.status(401).json({ message: 'password reset is invalid or expired' });
        });
    });

    return router;
}