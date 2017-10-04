const q = require('q');


module.exports = function({
    assessmentMarkModel,
    moduleModel
}) {
    return {
        addAssessmentFinalMarks: (marks, moduleCode, assessmentId) => {
            var deferred = q.defer();
            var year = new Date().getFullYear();

            moduleModel
                .findOne({code: moduleCode})
                .select('assessments.Y' + year)
                .exec((err, assessments) => {
                    if (!assessments || assessments.length || !_.findWhere(assessments, {_id: assessmentId})) {
                        deferred.reject({ message: 'assessment not found within this module'});
                    }

                    var newMarks = [];

                    for (var i = 0; i < marks.length; i++) {
                        var newMark = new assessmentMarkModel({
                            userId: marks[i].userId,
                            assessment: assessmentId,
                            finalResult: marks[i].mark
                        });
                        newMarks.push(newMark);
                    }

                    assessmentMarkModel.collection.insertMany(newMarks, (err) => {
                        if(err){
                            deferred.reject(err);
                        }
                        deferred.resolve();
                    });
                });

            return deferred.promise;
        },

        getMarksByAssessment: (code, assessmentId) => {
            var deferred = q.defer();
            var year = new Date().getFullYear();

            moduleModel
                .findOne({code: code})
                .select('assessments.Y' + year)
                .exec((err, assessments) => {

                    if (!assessments || assessments.length || !_.findWhere(assessments, {_id: assessmentId})) { 
                        deferred.reject({ message: 'assessment not found within this module'});
                    }

                    assessmentMarkModel.find({ assessment: assessmentId }, (err, marks) => {
                        if (err) {
                            deferred.reject(err);
                        }
                        
                        deferred.resolve(marks);
                    })
                });

            return deferred.promise;
        }
    }
}