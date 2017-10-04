const cryptoMock = require('../../utilities/crypto/crypto.mock')();
const UnauthorisedException = require('../../models/exceptions/UnauthorisedException');
let authService = require('./authentication')({
    crypto: cryptoMock
});

describe('authentication service', function(){
    
    let tokenObj, token, mockReq, mockRes;
    let unauthorisedException = new UnauthorisedException();

    let spyNext = {
        next: function(){}
    }

    beforeEach(function(){
        let currentDate = new Date();

        tokenObj = {
            userId: '123',
            username: 'Testee',
            fullname: 'Tester Von Testacles',
            userPermissions: {},
            ipAddress: '123.123.123.123',
            expiry: currentDate.setTime(currentDate.getTime() + (1*60*60*1000))
        };

        token = cryptoMock.encrypt(JSON.stringify(tokenObj));

        mockReq = {
            headers: {
                authorization: token
            },
            connection : {
                remoteAddress: '123.123.123.123'
            }
        }

        mockRes = {
            status: function(){},
            json: function(){},
            data: {}
        }

        spyOn(mockRes, 'status').and.returnValue(mockRes);
        spyOn(mockRes, 'json');
        spyOn(spyNext, 'next');
    })

    describe('authenticate method', function(){
        it ('should return authorised if token is valid', function(){
            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).not.toHaveBeenCalledWith(401);
            expect(spyNext.next).toHaveBeenCalledWith();
        });

        it ('should set the user in the request object', function(){
            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockReq.user).toBeDefined();
            expect(mockReq.user.userId).toBe('123');
            expect(spyNext.next).toHaveBeenCalledWith();
        });

        it ('should return unauthorised if token is invalid json', function(){
            token = cryptoMock.encrypt(JSON.stringify(tokenObj) + 'invalidjson');
            mockReq.headers.authorization = token;

            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(unauthorisedException);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it ('should return unauthorised if token is not encrypted', function(){
            token = JSON.stringify(tokenObj);
            mockReq.headers.authorization = token;

            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(unauthorisedException);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it ('should return unauthorised if token is expired', function(){
            currentDate = new Date();
            tokenObj.expiry = currentDate.setTime(currentDate.getTime() - (1*60*60*1000))
            token = cryptoMock.encrypt(JSON.stringify(tokenObj));
            mockReq.headers.authorization = token;

            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(unauthorisedException);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

         it ('should return unauthorised if ip address is different', function(){
            tokenObj.ipAddress = '321.321.321.321';
            token = cryptoMock.encrypt(JSON.stringify(tokenObj));
            mockReq.headers.authorization = token;

            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(unauthorisedException);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it ('should return unauthorised if token is not set', function(){
            mockReq.headers.authorization = undefined;

            authService.authenticate(mockReq, mockRes, spyNext.next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(unauthorisedException);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });
    });

    describe('generateAuthToken method', function(){

        let user = {
            id: '123',
            username: 'Testee',
            fullname: 'Tester Von Testacles',
            permissions: {}
        }
        let tokenResult = '*encrypted=' + JSON.stringify(tokenObj) + '=encrypted*';

        it('should return an encrypted json object of the user', function(done){
            authService.generateAuthToken(user, '123.123.123.123').then(function(token){
                expect(token).toMatch(/\*encrypted=/);
                expect(token).toMatch('Testee');
                done();
            })
        });
    });
})