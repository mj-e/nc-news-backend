const commentsModel = require('../models/comments');

function getCommentsByArticle(request, response) {
    commentsModel.find({ belongs_to: request.params.belongs_to }, function (error, comments) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ comments: comments });
    });
}

function getAllComments(request, response) {
    commentsModel.find({}, function (error, comments) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ comments: comments });
    });
}

function getCommentById(request, response, next) {
    commentsModel.findById(request.params.comment_id, function (error, articles) {
        if (error) {
            return next(error);
        }
        response.status(200).send({ articles: articles });
    });
}

function commentVote(request, response, next) {
    let query = {};
    if (request.query.vote === 'up') {
        query = { $inc: { votes: 1 } };
    }
    if (request.query.vote === 'down') {
        query = { $inc: { votes: -1 } };
    }
    commentsModel.update(request.params.comment_id, query, function (error, comment) {
        if (error) {
            return next(error);
        }
        next(null, comment);
    });
    response.status(206).send({ comment: 'COMMENT VOTE REQUEST SUCCESSFUL' });
}

function deleteCommentById(request, response, next) {
    commentsModel.findByIdAndRemove(request.params.comment_id, function (error) {
        if (error) {
            return next(error);
        }
        next(null);
    });
    response.status(204).send({ comment: 'COMMENT DELETE REQUEST SUCCESSFUL' });
}

module.exports = {
    getCommentsByArticle: getCommentsByArticle,
    commentVote: commentVote,
    getCommentById: getCommentById,
    getAllComments: getAllComments,
    deleteCommentById: deleteCommentById
};