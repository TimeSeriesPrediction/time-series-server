const AuthorisationService = require('./authorisation');
const UnauthorisedException = require('../../models/exceptions/UnauthorisedException');
const constants = require('../../constants');

describe('AuthorisationService', function() {
    let service = new AuthorisationService();

    let unauthorisedException = new UnauthorisedException();

    let spyNext;

    let mockRequest = {
        user: {
            admin: false,
            permissions: [
            ]
        }
    };

    let mockRes = {
        status: function(){},
        json: function(){},
        data: {}
    }

    beforeEach(function() {
        spyNext = {
            next: function(){}
        }

        spyOn(mockRes, 'status').and.returnValue(mockRes);
        spyOn(mockRes, 'json');
        spyOn(spyNext, 'next');

        mockRequest = {
            params: {
                moduleCode: 'COS301'
            },
            body: {

            },
            user: {
                permissions: {
                    admin: false,
                    modules: [
                    ]
                }
            }
        }
    })

    describe('authorise', function() {
        it ('should deny authorisation if not admin and no permissions', function() {
            service.authorise('moduleCode', constants.PERMISSION_TYPE.STUDENT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it ('should grant authorisation if admin and no other permissions', function() {
            mockRequest.user.permissions.admin = true;

            service.authorise('moduleCode', constants.PERMISSION_TYPE.STUDENT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith();
        });

        it ('should deny authorisation if user has permissions but not for right module', function() {
            mockRequest.user.permissions.modules.push({
                moduleCode: 'COS326',
                permission: constants.PERMISSION_TYPE.ADMIN_MANAGE
            });

            service.authorise('moduleCode', constants.PERMISSION_TYPE.STUDENT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it('should grant authorisation if user has permissions for right module', function() {
            mockRequest.user.permissions.modules.push({
                moduleCode: 'COS301',
                permission: constants.PERMISSION_TYPE.ADMIN_EDIT
            });

            service.authorise('moduleCode', constants.PERMISSION_TYPE.ADMIN_EDIT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith();
        });

        it('should grant authorisation if user has higher permissions than needed', function() {
            mockRequest.user.permissions.modules.push({
                moduleCode: 'COS301',
                permission: constants.PERMISSION_TYPE.ADMIN_MANAGE
            });

            service.authorise('moduleCode', constants.PERMISSION_TYPE.STUDENT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith();
        });

        it('should deny edit authorisation if user has view permissions for module only', function() {
            mockRequest.user.permissions.modules.push({
                moduleCode: 'COS301',
                permission: constants.PERMISSION_TYPE.STUDENT
            });

            service.authorise('moduleCode', constants.PERMISSION_TYPE.ADMIN_EDIT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it('should deny authorisation if moduleCode not given', function() {
            mockRequest.params = {};

            service.authorise('moduleCode', constants.PERMISSION_TYPE.ADMIN_EDIT)(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });
    });
    

    describe('adminOnly', function() {
        it ('should deny authorisation if not admin', function() {
            service.adminOnly(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith(unauthorisedException);
        });

        it ('should grant authorisation if admin', function() {
            mockRequest.user.permissions.admin = true;

            service.adminOnly(mockRequest, mockRes, spyNext.next);
            expect(spyNext.next).toHaveBeenCalledWith();
        });
    });

});