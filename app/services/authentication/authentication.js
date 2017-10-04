const q = require('q');
const requestIp = require('request-ip');
const Token = require('../../models/accessToken/accessTokenModel');
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

          var ip = requestIp.getClientIp(req);
          
          if (ip !== user.ipAddress){
             throw new UnauthorisedException();
          }

          res.data.authToken = crypto.encrypt(JSON.stringify(new Token({
            _id: user.userId,
            userId: user.username,
            fullname: user.fullname,
            permissions: user.userPermissions,
            ipAddress: user.ipAddress
          } , ip)));

          req.user = user;
        }
        catch(error){
          var ex = new UnauthorisedException();
          res.status(401).json(ex);
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
