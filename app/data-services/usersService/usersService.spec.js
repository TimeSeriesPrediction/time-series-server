
describe('UsersService', function(){

    var userModelMock, usersService;

    beforeEach(function(){
        userModelMock = require('../models/userModel.mock');
        usersService = require('../data-services/usersService')({
            userModel: userModelMock
        });
    });

    it('should return a list of users', function(done){
        usersService.getUsers().then(function(users){
            expect(users.length).toBe(2);
            done();
        });
    });

});