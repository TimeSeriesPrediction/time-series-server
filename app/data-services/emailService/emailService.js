const q = require('q');

module.exports = function({
    mailer
}) {

    return {

        sendForgottenPassword: function(email, exists, token){
            var deferred = q.defer();

            var subject = "Password Reset Email";
            var html;

            if (exists){
                html = "<h2>You have requested a password change, please use <a>http://localhost:3000/account/reset?=" + token +"</a></h2>"
            }
            else{
                html = "<h2>It seems someone has requested a password change for your address</h2>"
            }

            mailer.sendMail(email, subject, html)
            .then(function(info) {
                deferred.resolve(info);
            })
            .catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;          
        }

    }

}