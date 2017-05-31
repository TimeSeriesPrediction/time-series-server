const Token = require('../../models/accessToken/accessTokenModel');
const q = require('q');
const UnauthorisedException = require('../../models/exceptions/UnauthorisedException');


module.exports = function Authentication({
  crypto
}){

    return {
      authenticate: function(req, res, next){
        var token = req.headers['authorization'];

        try{
          //This will throw error if token is invalid
          var user = JSON.parse(crypto.decrypt(token));
          
          var date = new Date();
          if (date > new Date(user.expiry)){
            throw new UnauthorisedException();
          }

          var ip = req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress ||
                  req.connection.socket.remoteAddress;
          if (ip !== user.ipAddress){
             throw new UnauthorisedException();
          }

          req.user = user;
        }
        catch(error){
          var ex = new UnauthorisedException();
          res.status(401).send(ex);
          return next(ex);
        }

        next();
      },

      generateAuthToken: function generateAuthToken(user, ipAddress) {
          var deferred = q.defer();

          var unencryptedToken = new Token(user, ipAddress);
          deferred.resolve(crypto.encrypt(JSON.stringify(unencryptedToken)));

          return deferred.promise;
      }

    }
}
