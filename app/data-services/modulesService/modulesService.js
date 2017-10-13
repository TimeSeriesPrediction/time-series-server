const q = require('q');
const _ = require('underscore');
const constants = require('../../constants');

module.exports = function({
    moduleModel,
    userModel,
    assessmentModel,
    queryModel
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
                    userModel.find({ username: { $in: students.enrollments['Y' + year] }}, (err, users) => {
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

        getModulesByStudent: function(username, year) {
            var deferred = q.defer();
            
            var objFind = {};
            objFind["enrollments.Y" + year] = username;

            moduleModel.find(objFind, (err, modules) => {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(modules);
            });


            return deferred.promise;
        },

        getAssessmentsByModule: function(moduleCode, year) {
            var deferred = q.defer();
            moduleModel
                .findOne({code: moduleCode})
                .select('assessments.Y' + year)
                .exec((err, assessments) => {
                        if(assessments) {
                            deferred.resolve(assessments.assessments['Y' + year]);
                        } else {
                            deferred.reject(err);
                        }
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

            userModel.find({ username: { $in: userIds } }).update({ 
                $addToSet: {
                    'permissions.modules': {
                        moduleCode: moduleCode,
                        permission: constants.PERMISSION_TYPE.STUDENT
                    }
                }
            }).exec((err) => {
                        if(err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });

            return deferred.promise;
        },

        addAssessment : function(moduleCode, year, assessment) {
            var deferred = q.defer();
            let yearProp = 'Y' + year;

            moduleModel.findOne({ code: moduleCode} , function(err, mod) {
                if(mod){
                    if(!mod.assessments) {
                        mod.assessments = {};
                    }
                    var assessmentYear = mod.assessments[yearProp];
                    if(!assessmentYear){
                        mod.assessments[yearProp] = [];
                    }

                    var newAssessment = new assessmentModel(assessment);
                    newAssessment.validate(error => {
                        if (error){
                            deferred.reject(error);
                            return;
                        }
                        mod.assessments[yearProp].push(newAssessment);
                        mod.markModified('assessments');
                        mod.save(error => {
                            if (error) {
                                deferred.reject(error);
                            }

                            deferred.resolve();
                        });
                    })
                }
                else {
                    deferred.reject();
                }
                
            });
             return deferred.promise;
        },

        addQuery : function(moduleCode, year, number, query, username) {
            var deferred = q.defer();
            let yearProp = 'Y' + year;

            moduleModel.findOne({ code: moduleCode} , function(err, mod) {
                if(mod){
                    try {
                        if(!mod.assessments['Y' + year][number].queries) {
                            mod.assessments['Y' + year][number].queries = [];
                        }
                    } catch (e) {
                        deferred.reject();
                    }
                    
                    var newQuery = new queryModel({
                        username: username,
                        message: query
                    });
                    newQuery.validate((error) => {
                        if (error) {
                            deferred.reject(error);
                            return;
                        }
                        mod.assessments['Y' + year][number].queries.push(newQuery);
                        mod.markModified('assessments');
                        mod.save((error) => {
                            if (error) {
                                deferred.reject(error);
                            } else {
                                deferred.resolve();
                            }
                        });
                    });
                }
                else {
                    deferred.reject();
                }
                
            });
             return deferred.promise;
        },

        updateHOD: function(moduleCode, username) {
            var deferred = q.defer();

            moduleModel.findOne({ code: moduleCode} , function(err, mod) {
                if (mod) {
                    mod.HOD = mongoose.Types.ObjectId(username);
                    mod.save();
                    deferred.resolve();
                }
                else {
                    deferred.reject();
                }
            });

            userModel.find({ username: username }).update({ 
                $addToSet: {
                    'permissions.modules': {
                        moduleCode: moduleCode,
                        permission: constants.PERMISSION_TYPE.ADMIN_MANAGE
                    }
                }
            }).exec();

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
        },

        addStaff: function(moduleCode, username, permission) {
            var deferred = q.defer();

            userModel.findOne({ username: username }).update({ 
                $addToSet: {
                    'permissions.modules': {
                        moduleCode: moduleCode,
                        permission: permission
                    }
                }
            }).exec((err) => {
                        if(err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });

            return deferred.promise;
        }

    }
}