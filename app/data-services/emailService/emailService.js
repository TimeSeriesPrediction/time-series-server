const q = require('q');
const config = require('../../config/index');

module.exports = function({
    mailer
}) {

    return {

        sendForgottenPassword: function(email, token){
            var deferred = q.defer();

            var subject = "Password Reset Email";
            var html;

            html = "<h2>You have requested a password change, please use <a>" + config.baseUrl + " /account/reset?=" + token +"</a></h2>";

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