const express = require('express');
const router = express.Router();
const constants = require('../../constants');

module.exports = function ModulesApi ({
    marksService,
    authorisation
}){
    /**
    * @api {get} /marks/:assessmentId Gets marks by assessment
    * @apiName GetMarksByAssessment
    * @apiGroup Marks
    * @apiDescription  Gets all marks given to all students per assessment
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {String} code The module code for the assessment
    * @apiParam {String} assessmentId The object id of the assessment
    *
    * @apiSuccess {Object[]}  marks Module assessments
    * @apiSuccess {String}  marks.userId Student number
    * @apiSuccess {String}  marks.assessment Assessment id
    * @apiSuccess {Object[]}  marks.questionResults Nested question results
    * @apiSuccess {Number}  marks.finalResult Final result of assessment
    */
    router.get('/:code/:assessmentId', authorisation.authorise('code', constants.PERMISSION_TYPE.ADMIN_VIEW), (req, res) => {
        var assessmentId = req.params.assessmentId;
        var code = req.params.code;

        marksService.getMarksByAssessment(code, assessmentId)
        .then(function(marks) {
            res.data.marks = marks;
            res.status(200).send(res.data);
        })
        .catch(function(err){
            res.status(500).send(err)
        });
    });

    /**
    * @api {post} /marks/ adds final marks to an assessment
    * @apiName AddMarks
    * @apiGroup Marks
    * @apiDescription Adds final marks for an assessment
    *
    * @apiHeader (Authorization) {String} Authorization Authorization token
    *
    * @apiParam {Object[]} marks The marks array
    * @apiParam {String} marks.userId The student number
    * @apiParam {String} marks.mark The student's final mark for this assessment
    * @apiParam {String} assessmentId The assessment id to mark
    * @apiParam {String} moduleCode The module code associated with the assessment
    *
    * @apiSuccess (201) {Object}  response Response object
    * @apiSuccess (201) {String}  response.message Success message
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 201 Created
    *     {
    *       "message": "Marks added successfully"
    *     }
    */
    router.post('', authorisation.authorise('moduleCode', constants.PERMISSION_TYPE.ADMIN_EDIT), (req,res) => {
        var marks = req.body.marks;
        var assessmentId = req.body.assessmentId;
        var moduleCode = req.body.moduleCode;

        marksService.addAssessmentFinalMarks(marks, moduleCode, assessmentId)
        .then(function(){
            res.data.message = 'Marks added successfully';
            res.status(201).send(res.data);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    });

    return router;
} 