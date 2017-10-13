const express = require('express');
const requestIp = require('request-ip');
const router = express.Router();
const NotFoundException = require('../../models/exceptions/NotFoundException');

module.exports = function AnalysisApi({
    analysisService
}){

    /**
    * @api {post} /analysis/ Request an analysis
    * @apiName RequestAnalysis
    * @apiGroup Analysis
    * @apiDescription Requests an analysis for a user
    *
    * @apiParam {String} The CSV name to use
    * @apiParam {String} The analysis type (1 individual, 2 module)
    *
    * @apiSuccess {String}  Complete
    * @apiErrorExample {json} Error-Response:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       "message": "An error occured processing your request"
    *     }
    */
    router.post('/', function(req, res){
        var csvName = req.body.csvName;
        var analysisType = req.body.analysisType;

        if (!csvName || !analysisType){
            res.status(401).send({ message: 'Authorisation has been denied for this request'});
            return;
        }
        
        date = Date.now();

        analysisService.performAnalysis(csvName, analysisType, date)
        .then(function(msg){
            res.status(200).send({ message: msg});
        })
        .catch(function(){
            res.status(401).send({ message: 'An error occured processing your request'});
        });

    });

    return router;
}