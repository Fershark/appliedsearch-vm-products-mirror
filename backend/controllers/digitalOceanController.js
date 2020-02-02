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
                data : data.images.filter(image => {
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
        console.log("ERROR from DO-Controller:")
        console.log(err);
    }
};