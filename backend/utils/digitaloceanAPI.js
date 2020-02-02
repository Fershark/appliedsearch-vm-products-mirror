const https = require('https')

// function getDO() {
//     const options = {
//         hostname: 'api.digitalocean.com',
//         port: 443,
//         path: '/v2/regions',
//         //   method: 'POST',
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer a58290784893c0bbbda4dea370c7804dcbe18c3d42ad28a15b04ecb56926ad74'
//         }
//     }

//     inputChunks = [];
//     var body = '';

//     // const req = https.request(options, (res) => {
//     const req = https.get(options, (res) => {
//         //   console.log(`statusCode: ${res.statusCode}`)
//         //   console.log(`res: ${(res.headers)}`)

//         // res.setEncoding('utf8');
//         res.on('data', (d) => {

//             console.log(Date.now);
//             // process.stdout.write(d)
//             // parsedData = JSON.parse(d);
//             inputChunks.push(d);
//             body += d;
//             // console.log(parsedData)

//             // console.log(JSON.pad);

//             // var inputJSON = inputChunks.join(),
//             //     parsedData = JSON.parse(inputJSON),
//             //     outputJSON = JSON.stringify(parsedData, null, '    ');
//             // stdout.write(outputJSON);
//             // stdout.write('\n');
//             // console.log(outputJSON)
//         });

//         res.on('end', function () {

//             console.log("# : " + inputChunks.length)
//             // inputChunks.push(d)
//             var inputJSON = inputChunks.join(),
//                 parsedData = JSON.parse(body),
//                 outputJSON = JSON.stringify(parsedData);

//             // stdout.write(outputJSON);
//             // stdout.write('\n');
//             console.log(outputJSON)

//         });

//     })

//     req.on('error', (error) => {
//         console.error(error)
//     })

//     // req.write(data)
//     // req.end()
// }

// function postDO() {
//     const data = JSON.stringify({
//         "name": "example.com",
//         "region": "nyc3",
//         "size": "s-1vcpu-1gb",
//         "image": "ubuntu-16-04-x64",
//         "backups": false,
//         "user_data": null,
//         "private_networking": null,
//         "volumes": null,
//         "tags": [
//             "web"
//         ]
//     })

//     const options = {
//         hostname: 'api.digitalocean.com',
//         port: 443,
//         path: '/v2/droplets',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer a58290784893c0bbbda4dea370c7804dcbe18c3d42ad28a15b04ecb56926ad74'
//         }
//     }

//     const req = https.request(options, (res) => {
//         console.log(`statusCode: ${res.statusCode}`)

//         res.on('data', (d) => {
//             process.stdout.write(d)
//         })
//     })

//     req.on('error', (error) => {
//         console.error(error)
//     })

//     req.write(data)
//     req.end()
// }

// getDO();
// postDO();


module.exports = class DigitalOceanAPI {

    static getAPI(options) {

        return new Promise((resolve, reject) => {
            var body = '';

            const req = https.get(options, (res) => {

                res.on('data', (d) => {
                    body += d;
                });

                res.on('end', function () {
                    var parsedData = JSON.parse(body),
                        outputJSON = JSON.stringify(parsedData);

                    // console.log(outputJSON)

                    // return parsedData;
                    resolve(parsedData);
                });

            })

            req.on('error', (error) => {
                // console.error(error)
                // return {
                //     'error': error
                // }
                reject(error);
            })

            req.end()
        });

        // var body = '';

        // const req = https.get(options, (res) => {

        //     res.on('data', (d) => {
        //         body += d;
        //     });

        //     res.on('end', function () {
        //         var parsedData = JSON.parse(body),
        //             outputJSON = JSON.stringify(parsedData);

        //         // console.log(outputJSON)

        //         return parsedData;
        //     });

        // })

        // req.on('error', (error) => {
        //     // console.error(error)
        //     return {'error': error}
        // })

        // req.end()

    };

}