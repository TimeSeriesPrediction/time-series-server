const express = require('express');
const router = express.Router();

module.exports = function AccountApi({
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


    return router;
}