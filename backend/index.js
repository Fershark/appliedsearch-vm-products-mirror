// 'use strict';

const { NODE_HOST, NODE_PORT } = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// App
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const vmRoutes = require('./routes/vmRoute');
const userRoutes = require('./routes/userRoute');

// Place your main routers here
// ............................
app.use('/api/users', userRoutes);
app.use('/api/vms', vmRoutes);


app.use((req, res, next) => {
    res.status(404).send("<h1>Welcome to our API</h1>")
});

app.listen(NODE_PORT, NODE_HOST);
console.log(`Running on http://${NODE_HOST}:${NODE_PORT}`);