const express = require('express');
const requestIp = require('request-ip');
const router = express.Router();
const NotFoundException = require('../../models/exceptions/NotFoundException');

module.exports = function AccountApi({
    emailService,
    usersService,
    authentication
}){

    /**
    * @api {post} /account/token Request login token
    * @apiName GetAuthToken
    * @apiGroup Account
    * @apiDescription Logs the user in by returning an authentication token to be included in each subsequent request
    *
    * @apiParam {String} username User's unique username.
    * @apiParam {String} password User's password.
    *
    * @apiSuccess {Object}  response Token response object
    * @apiSuccess {String}  response.authToken Authentication token
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       "message": "authorisation has been denied for this request"
    *     }
    */
    router.post('/token', function(req, res){
        var username = req.body.username;
        var password = req.body.password;

        if (!username || !password){
            res.status(401).send({ message: 'Authorisation has been denied for this request'});
            return;
        }
    
        usersService.getAuthenticatedUser(username, password)
        .then(function(user){
            if (user){
                var ip = requestIp.getClientIp(req);

                authentication.generateAuthToken(user, ip).then(function(token){
                    res.status(200).send({
                        authToken: token
                    });
                });
            }
        })
        .catch(function(){
            res.status(401).send({ message: 'Authorisation has been denied for this request'});
        });

    });

    /**
    * @api {post} /account/forgot-password Request a password reset email
    * @apiName RequestPasswordResetEmail
    * @apiGroup Account
    * @apiDescription Requests a password reset token to be given to the user with the same email and sent to that email address.
    *
    * @apiParam {String} email Email address associated with your account.
    *
    * @apiSuccess {Object}  response Token response object
    * @apiSuccess {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 Success
    *     {
    *       "message": "an email was sent to example@example.com"
    *     }
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 404 Not Found
    *     {
    *       "message": "Email not found"
    *     }
    */
    router.post('/forgot-password', (req, res) => { 
        var email = req.body.email;

        usersService.generatePasswordResetToken(email)
        .then(function(token){
            emailService.sendForgottenPassword(email, token)
            .then(function(){
                res.data.message = 'An email was sent to ' + email;
                res.status(200).send(res.data);
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


    /**
    * @api {post} /account/reset-password Change a user's password
    * @apiName ResetPassword
    * @apiGroup Account
    * @apiDescription Changes a user's password with a password reset token
    *
    * @apiParam {String} token Password reset token.
    * @apiParam {String} password New password.
    *
    * @apiSuccess {Object}  response Token response object
    * @apiSuccess {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 200 Success
    *     {
    *       "message": "your password was successfully changed"
    *     }
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 401 Unauthorised
    *     {
    *       "message": "password reset is invalid or expired"
    *     }
    */
    router.post('/reset-password', function(req, res) {    
        var token = req.body.token;
        var password = req.body.password;
        
        usersService.setNewPassword(token, password)
        .then(function(){
            res.data.message = 'Your password was successfully changed';
            res.status(200).send(res.data);
        })
        .catch(function(){
            res.status(401).send({ message: 'Password reset is invalid or expired' });
        });
    });

    return router;
}