const q = require('q');
const _ = require('underscore');
var ObjectID = require('mongodb').ObjectID


module.exports = function({
    moduleModel
}) {
    return {
        addAssessmentFinalMarks: (marks, moduleCode, assessmentId) => {
            var deferred = q.defer();
            var year = new Date().getFullYear();

            moduleModel
                .findOne({code: moduleCode})
                .select('assessments.Y' + year)
                .exec((err, mod) => {
                    if (!mod) {
                        return deferred.reject({ message: 'Module does not exist.'});  
                    }

                    var assessment = _.find(mod.assessments['Y' + year], (assessment) => {
                        return assessment._id.equals(ObjectID(assessmentId));
                    } );

                    if (!assessment) {
                        return deferred.reject({ message: 'Assessment not found within this module.'});
                    }

                    var newMarks = [];


                    assessment.marks = [];


                    for (var i = 0; i < marks.length; i++) {
                        var oldMark = _.findWhere(assessment.marks, { username: marks[i].username });
                        if (!oldMark) {
                            assessment.marks.push({
                                username: marks[i].username,
                                mark: marks[i].mark
                            });
                        }
                        else {
                            oldMark.mark = marks[i].mark;
                        }
                    }

                    mod.markModified('assessments.Y' + year);
                    mod.save((err) => {
                        if (err) {
                            return deferred.reject(err);
                        }
                        return deferred.resolve();
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
                .exec((err, mod) => {

                    if (!mod) {
                        deferred.reject({ message: 'Module does not exist.'});  
                    }

                    var assessment = _.find(mod.assessments['Y' + year], (assessment) => {
                        return assessment._id.equals(ObjectID(assessmentId));
                    } );

                    if (!assessment) {
                        deferred.reject({ message: 'Assessment not found within this module.'});
                    }

                    deferred.resolve(assessment.marks);
                });

            return deferred.promise;
        }
    }
}