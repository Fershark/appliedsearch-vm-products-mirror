const dotenv = require('dotenv');
dotenv.config();

// PLACE YOUR CONFIG VARIABLES HERE (.env file)
module.exports = {
    NODE_HOST: process.env.NODE_HOST,
    NODE_PORT: process.env.NODE_PORT
}