const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const q = require('q');
const email_config = require('config').get('email_server');

var connected;

// Configuration for the nodemailer transporter
let configuration = {};

/* 
* This connects to a service (Outlook, Gmail, Sendgrid etc.) if a service is set in the config.
* If unavailable, one must configure a host along with port to connect directly via smtp.
*/
if (emailSettings.has('service')) {
    configuration.service = email_config.get('service');
}
else {
    configuration.host = email_config.get('host');
    configuration.secure = email_config.get('secure');
}

configuration.pool = email_config.get('pooling'); // Use thread pooling for email
configuration.auth = {};
configuration.auth.user = email_config.get('authentication.username');
configuration.auth.pass = email_config.get('authentication.password');

if (config.has('tls.ciphers')) {
    configuration.tls = {};
    configuration.tls.ciphers = email_config.get('tls.ciphers');
}

let transporter = nodemailer.createTransport(configuration);
transporter.use('compile', htmlToText()); //Sets the text field of an email based on html
  
// Verfiy whether mailer is ready to receive emails or not
transporter.verify(function(error, success) {
   if (error) {
        console.log("Failed to start mail service with " + error);
        console.log("Mail features will be disabled till configuration is corrected")
        connected = false;
   } else {
        console.log('Mail service is ready to receive messages');
        connected = true;
   }
});

// Set the display name and senders address for your server
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

            if (!connected)
            {
                deferred.reject("Mail service is currently not active");
            }
            
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