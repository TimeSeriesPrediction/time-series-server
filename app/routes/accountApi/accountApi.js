const express = require('express');
const router = express.Router();
const NotFoundException = require('../../models/exceptions/NotFoundException');

module.exports = function AccountApi({
    emailService,
    usersService,
    authentication
}){

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

    router.post('/forgot-password', (req, res) => { 
        var email = req.body.email;
        var token;

        usersService.generatePasswordResetToken(email)
        .then(function(token){
            emailService.sendForgottenPassword(email, token)
            .then(function(){
                res.status(200).json({ message: 'an email was sent to ' + email });
            })
            .catch(function(error){
                res.status(500).send();
            });
        })
        .catch(function(err){
            if (err instanceof NotFoundException){
                res.status(404).json(err);
            }

             res.status(500).send();
        })
        
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