describe('UsersService', function(){

    var userModelMock, usersService;

    beforeEach(function(){
        userModelMock = require('../../models/userModel/userModel.mock');
        usersService = require('./usersService')({
            userModel: userModelMock
        });
    });

    describe('getUsers method', function(){

        it('should return a list of users', function(done){
            usersService.getUsers().then(function(users){
                expect(users.length).toBe(2);
                done();
            });
        });
        
    })

});