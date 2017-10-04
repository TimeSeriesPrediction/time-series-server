const UnauthorisedException = require('../../models/exceptions/UnauthorisedException');
const _ = require('underscore');

module.exports = function Authorisation(){
    return {
      authorise: function(moduleCodeParamName, permissionRequired){   
        return function(req, res, next) {
            var moduleCode = req.params[moduleCodeParamName] || req.body[moduleCodeParamName];

            if (moduleCode) {
                var permissions = req.user.permissions;

                if (req.user.permissions.admin) {
                    return next();
                }

                var modulePermissions = _.findWhere(permissions.modules, { moduleCode: moduleCode });

                if (modulePermissions && modulePermissions.permission >= permissionRequired) {
                    return next();
                }
            }

            var ex = new UnauthorisedException();
            res.status(401).json(ex);
            return next(ex);
        }
      },
      adminOnly: function(req, res, next) {
        if (req.user.permissions.admin) {
            return next();
        }
        var ex = new UnauthorisedException();
        res.status(401).json(ex);
        return next(ex);
      }
    }
}
