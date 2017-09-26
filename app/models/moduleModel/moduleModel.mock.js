module.exports = {
    find: function(query, callback){
        callback(null, [
            {
                code: "COS301"
            },
            {
                code: "COS326"
            }
        ])
    },

    findOne: function(query, callback){
        callback(null, {
                code: "COS326"
            }
        )
    }
}