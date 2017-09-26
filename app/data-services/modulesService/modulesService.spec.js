describe('ModulesService', function(){

    let moduleModel, userModel, assessmentModel, queryModel;
    let modulesService;

    beforeEach(function() {
        moduleModel = require('../../models/moduleModel/moduleModel.mock');
        userModel = require('../../models/userModel/userModel.mock');
        assessmentModel = require('../../models/assessmentModel/assessmentModel.mock');
        queryModel = require('../../models/queryModel/queryModel.mock');

        spyOn(moduleModel, 'findOne').and.callThrough();

        modulesService = require('./modulesService')({
            moduleModel,
            userModel, 
            assessmentModel, 
            queryModel
        });
    });

    describe('getModules', function() {
        it('should resolve all the modules', function(done) {
            modulesService.getModules().then(function(modules){
                expect(modules.length).toBe(2);
                expect(modules).toContain({ code: 'COS326'});
                done();
            });
        });
    });

    describe('getModuleByCode', function() {
        it ('should call findOne with module code', function(done) {
            modulesService.getModuleByCode('COS326').then(function() {
                expect(moduleModel.findOne.calls.mostRecent().args[0]).toEqual({ code: 'COS326'});
                done();
            });
        });

        it ('should resolve with module', function(done) {
            modulesService.getModuleByCode('COS326').then(function(mod) {
                expect(mod).toEqual({ code: 'COS326'});
                done();
            });
        });
    });

    describe('getStudentsByModule', function() {

    });

    describe('getModulesByStudent', function() {
        
    });

    describe('getAssessmentsByModule', function() {

    });

    describe('addModule', function() {

    });

    describe('enrollStudents', function() {
        
    });

    describe('addAssessment', function() {

    });

    describe('addQuery', function() {

    });

    describe('updateHOD', function() {
        
    });

    describe('removeModule', function() {

    });


});