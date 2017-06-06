const nodemailer = require('nodemailer');
const q = require('q');
const emailSettings = require('../../config').email_server;

let transporter = nodemailer.createTransport({
    pool: emailSettings.pooling,
    host: emailSettings.host,
    secure: emailSettings.secure,
    auth: {
        user: emailSettings.authentication.username,
        pass: emailSettings.authentication.password
    },
    tls: {
        ciphers:'SSLv3'
    }
});

let mailOptions = {
    from: emailSettings.authentication.username
};

module.exports = function(){

    return {

        sendMail: function(email, subject, html) {
            var deferred = q.defer();

            mailOptions.to = email;
            mailOptions.subject = subject;
            mailOptions.html = html;

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    deferred.reject(error);
                }
                else
                {
                    deferred.resolve(info);
                }
            });

            return deferred.promise;
      
        }
    }
}