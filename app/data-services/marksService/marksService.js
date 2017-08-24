const q = require('q');


module.exports = function({
    assessmentMarkModel
}) {
    return {
        addAssessmentFinalMarks: (marks, assessmentId) => {
            var deferred = q.defer();
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

            return deferred.promise;
        },

        getMarksByAssessment: (assessmentId) => {
            var deferred = q.defer();

            assessmentMarkModel.find({ assessment: assessmentId}, (err, marks) => {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(marks);
            })

            return deferred.promise;
        }
    }
}