const q = require('q');
const _ = require('underscore');

module.exports = function({
    moduleModel,
    userModel
}) {
    return {

        getModules: function() {
            var deferred = q.defer();

            moduleModel.find({}, (err, modules) => {
                if (err){
                    deferred.reject(err);
                }

                deferred.resolve(modules);
            });

            return deferred.promise;
        },

        getModuleByCode: function(moduleCode) {
            var deferred = q.defer();

            moduleModel.findOne({code: moduleCode}, (err, mod) => {
                if (mod) {
                    deferred.resolve(mod);
                }
                else{
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        getStudentsByModule: function(moduleCode, year) {
            var deferred = q.defer();

            moduleModel
                .findOne({code: moduleCode})
                .select('enrollments.Y' + year)
                .exec((err, students) => {
                    userModel.find({ userId: { $in: students.enrollments['Y' + year] }}, (err, users) => {
                        if (users) {
                            deferred.resolve(users);
                        }
                        else{
                            deferred.reject(err);
                        }
                    });
                });

            return deferred.promise;
        },

        getAssessmentsByModule: function(moduleCode, year) {
            var deferred = q.defer();

            moduleModel
                .findOne({code: moduleCode})
                .select('assessments.Y' + year)
                .exec((err, assessments) => {
                    //Get assessments from assessment ids
                });

            return deferred.promise;
        },

        addModule: function(name, code, hod) {
            var deferred = q.defer();

            let mod = new moduleModel({
                name: name,
                code: code,
                HOD: hod
            });

            mod.save(error => {
                if (error) {
                    deferred.reject(error);
                }

                deferred.resolve();
            });

            return deferred.promise;
        },

        enrollStudents: function(moduleCode, userIds, year) {
            var deferred = q.defer();
            let yearProp = 'Y' + year;

            moduleModel.findOne({ code: moduleCode} , function(err, mod) {
                if (mod) {
                    if (!mod.enrollments) {
                        mod.enrollments = {};
                    }
                    var enrollmentYear = mod.enrollments[yearProp];
                    if (!enrollmentYear) {
                        mod.enrollments[yearProp] = [];
                    }
                    mod.enrollments[yearProp] = mod.enrollments[yearProp].concat(userIds);
                    mod.markModified('enrollments');
                    mod.save();
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        updateHOD: function(moduleCode, userId) {
            var deferred = q.defer();

            moduleModel.findOne({ code: moduleCode} , function(err, mod) {
                if (mod) {
                    mod.HOD = mongoose.Types.ObjectId(userId);
                    mod.save();
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        removeModule: function(moduleCode) {
            var deferred = q.defer();

            moduleModel.remove({ code: moduleCode}, function(err) {
                if (!err) {
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
            });

            return deferred.promise;
        }

    }
}