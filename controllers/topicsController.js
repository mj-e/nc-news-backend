const topicsModel = require('../models/topics');

function getAllTopics(request, response) {
    topicsModel.find({}, function (error, topics) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ topics: topics });
    });
}

module.exports = {
    getAllTopics: getAllTopics
};