
let crypto = require('./crypto')();
const constants = require('../../constants');

describe ('crypto', function(){

    var data = 'How much wood would a wood chuck chuck if a wood chuck could chuck wood?';

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
});