let crypto = require('../../utilities/crypto/crypto')();
let UserModel = require('./userModel')({
    crypto
});


describe('user model', function(){

    let passwordHash = 'd7cabb117bc360197f633490089091edd409c9e4b59b6a499ba91670a3a3390e'; //For P@55word
    let user;

    beforeEach(function(){
        user = new UserModel({
            password: passwordHash
        });
    });

    it ('should validate correct password', function(done){
        user.verifyPassword('P@55word')
        .then(function(){
            done();
        })
        .catch(function(){
            fail('Correct password failed to validate!');
            done();
        });
    });

    it ('should invalidate incorrect password', function(){
        user.verifyPassword('password')
        .then(function(){
            fail('Incorrect password validated successfully!');
            done();
        })
        .catch(function(){
            done();
        });
    });

    it ('should invalidate incorrect case', function(){
        user.verifyPassword('p@55word')
        .then(function(){
            fail('Incorrect password validated successfully!');
            done();
        })
        .catch(function(){
            done();
        });
    });

    it ('should invalidate extra spaces', function(){
        user.verifyPassword('P@55word ')
        .then(function(){
            fail('Incorrect password validated successfully!');
            done();
        })
        .catch(function(){
            done();
        });
    });
})