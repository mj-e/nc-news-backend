if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const apiRouter = require('./routes/routes');
const DB = config.DB[process.env.NODE_ENV] || process.env.DB;
const PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const app = express();
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(DB, function (err) {
    if (!err) {
        console.log(`connected to the Database: ${DB}`);
    } else {
        console.log(`error connecting to the Database ${err}`);
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use('/', apiRouter);

app.use('/*', function (request, response) {
    response.status(404).send({ reason: 'ROUTE NOT FOUND' });
});

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}`);
});

app.use(function (error, request, response, next) {
  if (error.name === 'CastError') {
    return response.status(400).send({
      reason: `No article ${error.value} found`,
      stack_trace: error
    });
  }
  return next(error);
});

app.use(function (error, request, response) {
  return response.status(500).send({error: error});
});