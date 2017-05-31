
module.exports = {
    find: function(query, callback){
        callback(null, [
            {
                "_id": "5926f3085a76f4000f627ba9",
                "name": "Jim",
                "__v": 0
            },
            {
                "_id": "5926f30b5a76f4000f627baa",
                "name": "Sarah",
                "__v": 0
            }
        ])
    },

    findById: function(query, callback){
        callback(null, {
                "_id": "5926f3085a76f4000f627ba9",
                "name": "Jim",
                "__v": 0
            });
    }
}