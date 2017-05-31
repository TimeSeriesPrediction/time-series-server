let request = require('request');

const base_url = 'http://localhost:3000/';

describe('The api', function(){ 

    it('should return correct result at GET /', function(done){
        request.get(base_url, function(error, response, body) {
            expect(error).toBeNull();
            expect(response.statusCode).toBe(200);
            expect(body).toBe("api works");
            done();
        });
    });
    
});