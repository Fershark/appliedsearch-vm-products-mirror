const http = require('http');

module.exports = class RequestHTTP {

    static get(options) {
        return new Promise((resolve, reject) => {
            var body = '';

            const req = http.get(options, (res) => {

                res.on('data', (d) => {
                    body += d;
                });

                res.on('end', function () {
                    var parsedData = JSON.parse(body),
                        outputJSON = JSON.stringify(parsedData);

                    // return parsedData;
                    resolve(parsedData);
                });

            })

            req.on('error', (error) => {
                reject(error);
            })

            req.end()
        });
    };

    static post(options, postData) {

        return new Promise((resolve, reject) => {
            const data = JSON.stringify(postData)

            var resBody = ''

            const req = http.request(options, (res) => {
                console.log(`statusCode: ${res.statusCode}`)

                res.on('data', (d) => {
                    resBody += d
                })

                res.on('end', function () {
                    var parsedData = JSON.parse(resBody);

                    // return parsedData;
                    resolve(parsedData);
                });


            })

            req.on('error', (error) => {
                console.error(error)
                reject(error)
            })

            req.write(data)
            req.end()

        });
    };

    static delete(options) {

        return new Promise((resolve, reject) => {

            const req = http.request(options, (res) => {

                console.log(`statusCode: ${res.statusCode}`)

                if(res.statusCode == 204){
                    resolve({"message": "Delete Success!"})
                }else
                    resolve({"error": "Delete Fail!"})

            })

            req.on('error', (error) => {
                console.error(error)
                reject(error)
            })
     
            req.end()
        });
    };

}