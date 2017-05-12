if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';


const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const apiRouter = require('./routes/routes');
const DB = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const app = express();


mongoose.Promise = global.Promise;
mongoose.connect(DB, function (err) {
    if (!err) {
        console.log(`connected to the Database: ${DB}`);
    } else {
        console.log(`error connecting to the Database ${err}`);
    }
});

app.use('/', apiRouter);

app.use('/*', function (request, response) {
    response.status(404).send({ reason: 'ROUTE NOT FOUND' });
});

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});