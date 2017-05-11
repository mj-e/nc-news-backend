const express = require('express');
const router = express.Router();

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

module.exports = router;