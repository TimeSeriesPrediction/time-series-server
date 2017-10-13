const q = require('q');
var PythonShell = require('python-shell');

module.exports = function() {
    return {
        performAnalysis: function(csvName, analysisType, uniqueID){
            var deferred = q.defer();

            var options = {
                mode: 'text',
                args: [csvName, analysisType, uniqueID]
            };
            
            PythonShell.run('time-series-analysis-engine.py', options, function (err, results) {
                deferred.resolve("Complete");
            });

            deferred.reject("Failed");

            return deferred.promise; 
        }
    }
};