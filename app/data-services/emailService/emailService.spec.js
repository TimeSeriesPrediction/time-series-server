
let q = require('q');

describe('Email Service', function() {

    let emailService;

    let mockMailer = {
        sendMail: function(){
            var deferred = q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    }

    beforeEach(function(){
        emailService = require('./emailService')({
            mailer: mockMailer
        })

        spyOn(mockMailer, 'sendMail').and.callThrough();
    })

    it('should send email wih correct url', function(){
        emailService.sendForgottenPassword('test@email.com', '*T0K3N*');
        expect(mockMailer.sendMail.calls.mostRecent().args[0]).toMatch(/test@email.com/);
        expect(mockMailer.sendMail.calls.mostRecent().args[1]).toMatch(/Password Reset Email/);
        expect(mockMailer.sendMail.calls.mostRecent().args[2]).toMatch(/http/);
        expect(mockMailer.sendMail.calls.mostRecent().args[2]).toMatch(/\/account\/reset\?\=\*T0K3N\*/);
    });

});