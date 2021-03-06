const validUrl = require('valid-url');
const constants = require('../../constants');
let crypto = require('./crypto')();

describe ('crypto', function(){

    var data = 'How much wood would a wood chuck chuck if a wood chuck could chuck wood?';

    describe('encrypt/decrypt method', function(){

        it ('should encrypt and decrypt data', function(){
            var encrypted = crypto.encrypt(data);

            expect(encrypted).not.toEqual(data);
            expect(encrypted).not.toMatch('wood');
            expect(encrypted).not.toMatch('would');
            expect(encrypted).not.toMatch('chuck');
            expect(encrypted).not.toMatch('could');

            var decrypted = crypto.decrypt(encrypted);
            expect(decrypted).toBe(data);
        });

    });

    describe('getSalt method', function(){

        it ('should always return the same length salt', function(done){
            crypto.getSalt().then(function(salt){
                expect(salt.length).toBe(constants.SALT_LENGTH * 2);
                done();
            });
        });

        it('should append the salt to the hash', function(){
            crypto.getSalt().then(function(salt){
                crypto.hash(data, salt).then(function(hash){
                    expect(encrypted).not.toMatch('wood');
                    expect(encrypted).not.toMatch('would');
                    expect(encrypted).not.toMatch('chuck');
                    expect(encrypted).not.toMatch('could');
                    expect(hash.substr(hash.length - (constants.SALT_LENGTH * 2))).toBe(salt);
                    done();
                });       
            });
        });

        it('should always compute the same hash with the same data', function(done){
            crypto.getSalt().then(function(salt){
                crypto.hash(data, salt).then(function(firstHash){
                    crypto.hash(data, salt).then(function(secondHash){
                        expect(firstHash).toEqual(secondHash);
                        done();
                    });     
                });       
            });
        });

    });

    describe('generateResetToken method', function(){

        it('should generate a URL safe string of random bytes', function(){
            crypto.generateResetToken()
            .then(function(token){
                validUrl.isWebUri(token)
                .then(function(result){
                    expect(result).toBe(true);
                });
            });
        });

        it('should generate a random string of exactly 20 characters', function(){
            crypto.generateResetToken()
            .then(function(testString){
                expect(testString.length).toBe(20);
            })   
        });
    
    });

});