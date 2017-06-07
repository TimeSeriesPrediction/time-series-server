const nodemailer = require('nodemailer');
const q = require('q');
const emailSettings = require('../../config').email_server;

// TODO: Allow for services (GMail, Outlook, SendGrid) to be used in place of standard host url
let transporter = nodemailer.createTransport({
    pool: emailSettings.pooling,
    host: emailSettings.host,
    secure: emailSettings.secure,
    auth: {
        user: emailSettings.authentication.username,
        pass: emailSettings.authentication.password
    },
    tls: {
        // TODO: Custom ciphers in config, will depend on provider which to use (SSLv3 used for outlook)
        ciphers:'SSLv3'
    }
});

let mailOptions = {
    from: {
        name: emailSettings.display_name,
        address: emailSettings.authentication.username,
    }
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
                else {
                    deferred.resolve(info);
                }
            });

            return deferred.promise;
      
        }
    }
}