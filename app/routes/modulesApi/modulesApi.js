const express = require('express');
const router = express.Router();

module.exports = function ModulesApi ({
    modulesService
}){

    /**
    * @api {get} /modules/ Get all modules
    * @apiName GetModules
    * @apiGroup Modules
    * @apiDescription Gets all modules from database
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiSuccess {Object[]}  modules Array of modules
    * @apiSuccess {String}  modules._id DB Id
    * @apiSuccess {String}  modules.name Name
    * @apiSuccess {String}  modules.code Module Code
    */
    router.get('/', (req, res) => {
        
        modulesService.getModules()
        .then(function(modules){
            res.data.modules = modules;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /**
    * @api {get} /modules/:moduleCode Get specific module
    * @apiName GetModule
    * @apiGroup Modules
    * @apiDescription Gets a specific module by module code
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} moduleCode The module code of the module to retrieve
    *
    * @apiSuccess {Object}  Module retrieved
    * @apiSuccess {String}  modules._id DB Id
    * @apiSuccess {String}  modules.name Name
    * @apiSuccess {String}  modules.code Module Code
    */
    router.get('/:moduleCode',  (req, res) => {
        modulesService.getModuleByCode(req.params.moduleCode)
        .then(function(mod) {
            res.status(200).json(mod);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });


    /**
    * @api {get} /modules/students/:year/:code Gets students by module
    * @apiName GetStudentsByModule
    * @apiGroup Modules
    * @apiDescription  Gets all students enrolled for a module in a specific year
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code The module code of the enrollments to retrieve
    * @apiParam {String} year The year of enrollment to get
    *
    * @apiSuccess {Object[]}  students Enrolled Students
    * @apiSuccess {String}  students._id DB Id
    * @apiSuccess {String}  students.userId student or staff number
    * @apiSuccess {String}  students.email user email
    */
    router.get('/students/:year/:code', (req, res) => {
        var year = req.params.year;
        var code = req.params.code;

        if (!year || !code) {
            res.data.message = 'Please provide a year and a module code.';
            res.status(400).send(res.data);
        }

        modulesService.getStudentsByModule(code, year)
        .then(function(students) {
            res.data.students = students;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /**
    * @api {get} /modules/assessments/:year/:code Gets assessments by module
    * @apiName GetAssessmentsByModule
    * @apiGroup Modules
    * @apiDescription  Gets all assessments for a module in a specific year
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code The module code of the assessments to retrieve
    * @apiParam {String} year The year of assessments to get
    *
    * @apiSuccess {Object[]}  assessments Module assessments
    * @apiSuccess {String}  assessments._id DB Id
    */
    router.get('/assessments/:year/:code', (req, res) => {
        var year = req.params.year;
        var code = req.params.code;

        if (!year || !code) {
            res.data.message = 'Please provide a year and a module code.';
            res.status(400).send(res.data);
        }

        modulesService.getAssessmentsByModule(code, year)
        .then(function(assessments) {
            res.data.assessments = assessments;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /**
    * @api {post} /modules/ Adds a module
    * @apiName AddModule
    * @apiGroup Modules
    * @apiDescription Adds a module to the database
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} name module name
    * @apiParam {String} code module code
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Module created successfully"
    *     }
    */
    router.post('', (req,res) => {
        var name = req.body.name;
        var code = req.body.code;
        var hod = req.body.hod;

        modulesService.addModule(name, code, hod)
        .then(function(){
            res.data.message = 'Module created successfully';
            res.status(201).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    /**
    * @api {post} /modules/query Adds a query 
    * @apiName AddQuery
    * @apiGroup Modules
    * @apiDescription Adds a query to an assignment in the database
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code module code
    * @apiParam {String} year module year
    * @apiParam {String} number assignment number
    * @apiParam {Object}query the query object
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Query added successfully"
    *     }
    */
    router.post('/query', (req,res) => {
        var year = req.body.year;
        var code = req.body.code;
        var number = req.body.number;
        var query = req.body.query

        modulesService.addQuery(code,year,number,query)
        .then(function(){
            res.data.message = 'Query added successfully';
            res.status(201).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });
    
    /**
    * @api {put} /modules/enroll Enroll students
    * @apiName EnrollStudents
    * @apiGroup Modules
    * @apiDescription enrolls a list of students in a module
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code module code
    * @apiParam {Number} year year of enrollment
    * @apiParam {String[]} studentNrs Array of student numbers to enroll
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Students enrolled successfully"
    *     }
    */
    router.put('/enroll', (req, res) => {
        var code = req.body.code;
        var year = req.body.year;
        var studentNrs = req.body.studentNrs;

        modulesService.enrollStudents(code, studentNrs, year)
        .then(function(){
            res.data.message = 'Students enrolled successfully';
            res.status(200).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    /**
    * @api {put} /modules/assessment Add assessments
    * @apiName AddAssessments
    * @apiGroup Modules
    * @apiDescription Adds an assessment to a module (existing)
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code module code
    * @apiParam {Number} year year of enrollment
    * @apiParam {Object} assessment The assessment json object to add
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Assessment added successfully"
    *     }
    */
    router.put('/assessment', (req, res) => {
        var code = req.body.code;
        var year = req.body.year;
        var assessment = req.body.assessment;

        modulesService.addAssessment(code, year, assessment)
        .then(function(){
            res.data.message = 'Assessment added successfully';
            res.status(200).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    /**
    * @api {put} /modules/assign-hod Assign HOD
    * @apiName AssignHOD
    * @apiGroup Modules
    * @apiDescription Assigns a new HOD to a module
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code module code
    * @apiParam {String} staffNumber staff Number
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "New HOD assigned"
    *     }
    */
    router.put('/assign-hod', (req, res) => {
        var code = req.body.code;
        var staffNumber = req.body.staffNumber;

        modulesService.updateHOD(code, staffNumber)
        .then(function(){
            res.data.message = 'New HOD assigned';
            res.status(200).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    /**
    * @api {delete} /modules/delete?code Delete module
    * @apiName DeleteModule
    * @apiGroup Modules
    * @apiDescription Deletes a module from the DB
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code module code
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Module removed"
    *     }
    */
    router.delete('', (req, res) => {
        var code = req.query.code;

        modulesService.removeModule(code)
        .then(function(){
            res.data.message = 'Module removed';
            res.status(200).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    return router;
} 