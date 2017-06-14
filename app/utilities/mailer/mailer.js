const nodemailer = require('nodemailer');
const q = require('q');
const email_config = require('config').get('email_server');

// TODO: Allow for services (GMail, Outlook, SendGrid) to be used in place of standard host url
let transporter = nodemailer.createTransport({
    pool: email_config.get('pooling'),
    host: email_config.get('host'),
    secure: email_config.get('secure'),
    auth: {
        user: email_config.get('authentication.username'),
        pass: email_config.get('authentication.password')
    },
    tls: {
        ciphers: email_config.get('tls.ciphers')
    }
});

let mailOptions = {
    from: {
        name: email_config.get('display_name'),
        address: email_config.get('authentication.username')
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