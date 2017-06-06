const q = require('q');

module.exports = function({
    mailer
}) {

    return {

        sendForgottenPassword: function(email){
            var deferred = q.defer();

            var subject = "Password Reset Email";
            var html = "<h2>A password reset has been requested for your account.</b>";

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