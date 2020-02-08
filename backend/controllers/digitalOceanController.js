// const Item = require('../models/item');
// const Review = require('../models/review');
// const { UPLOAD_IMAGE_FOLDER } = require('../config');
const DigitalOceanAPI = require('../utils/digitaloceanAPI');
const {
    DIGITAL_OCEAN_API_TOKEN
} = require('../config');

exports.getAllDistributions = async (req, res, next) => {

    const options = {
        hostname: 'api.digitalocean.com',
        port: 443,
        path: '/v2/images?page=1&per_page=100&type=distribution',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
        }
    }

    try {
        var data = await DigitalOceanAPI.getAPI(options)

        const distributionNames = ['Ubuntu', 'FreeBSD', 'Fedora', 'Debian', 'CentOS'];

        let distributions = [];

        distributionNames.forEach(name => {
            distributions.push({
                name: name,
                data: data.images.filter(image => {
                    return image.distribution == name
                }).map(image => {
                    return {
                        "id": image.id,
                        "name": image.name,
                        "slug": image.slug
                    }
                })
            })
        });




        // distributions = data["images"];

        res.status(200).json(distributions)
    } catch (err) {
        res.status(404).json(err)
        console.log("ERROR from DO-Controller: getAllDistributions")
        console.log(err);
    }
};

exports.getAllSizes = async (req, res, next) => {

    const options = {
        hostname: 'api.digitalocean.com',
        port: 443,
        path: '/v2/sizes',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
        }
    }

    try {
        var data = await DigitalOceanAPI.getAPI(options)

        res.status(200).json(data.sizes.filter(size => size.available == true))

    } catch (err) {
        res.status(404).json(err)
        console.log("ERROR from DO-Controller: getAllSizes")
        console.log(err);
    }
};

exports.getAllRegions = async (req, res, next) => {

    const options = {
        hostname: 'api.digitalocean.com',
        port: 443,
        path: '/v2/regions',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
        }
    }

    try {
        var data = await DigitalOceanAPI.getAPI(options)

        res.status(200).json(data.regions)

    } catch (err) {
        res.status(404).json(err)
        console.log("ERROR from DO-Controller: getAllRegions")
        console.log(err);
    }
};

exports.createVMs = async (req, res, next) => {

    const options = {
        hostname: 'api.digitalocean.com',
        port: 443,
        path: '/v2/droplets',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
        }
    }

    const postData = req.body
    // example req.body
    // {
    //     "names": ["example.com1"],
    //     "region": "nyc3",
    //     "size": "s-1vcpu-1gb",
    //     "image": "ubuntu-16-04-x64",
    //     "backups": false,
    //     "user_data": null,
    //     "private_networking": null,
    //     "volumes": null,
    //     "tags": [
    //         "web"
    //     ]
    // }

    try {
        var data = await DigitalOceanAPI.postAPI(options, postData)

        res.status(200).json(data)

    } catch (err) {
        res.status(404).json(err)
        console.log("ERROR from DO-Controller: createVMs")
        console.log(err);
    }
};

exports.deleteVMsByTags = async (req, res, next) => {

    console.log(req.params.tags);
    const options = {
        hostname: 'api.digitalocean.com',
        port: 443,
        path: '/v2/droplets?tag_name=' + req.params.tags,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
        }
    }

    try {
        var data = await DigitalOceanAPI.deleteAPI(options)

        res.status(200).json(data)

    } catch (err) {
        res.status(404).json(err)
        console.log("ERROR from DO-Controller: createVMs")
        console.log(err);
    }
};