const usersModel = require('../models/users');

function getAllUsers(request, response) {
    usersModel.find({}, function (error, users) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ users: users });
    });
}

function getUserProfile(request, response, next) {
    
    usersModel.find({username: request.params.username}, function (error, users) {
        if (error) {
            return next(error);
        }
        response.status(200).json({ users: users });
    });
}

module.exports = {
    getAllUsers: getAllUsers,
    getUserProfile: getUserProfile
};