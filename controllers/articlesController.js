const articlesModel = require('../models/articles');
const commentsModel = require('../models/comments');
const async = require('async');


function getArticlesByTopic(request, response) {
    articlesModel.find({ belongs_to: request.params.belongs_to }, function (error, articles) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ articles: articles });
    });
}

function getAllArticles(request, response) {
    articlesModel.find({}, function (error, articles) {
        if (error) {
            return response.status(500).send({ error: error });
        }
        response.status(200).send({ articles: articles });
    });
}

function getArticleById(request, response, next) {
    articlesModel.findById(request.params.article_id, function (error, articles) {
        if (error) {
            return next(error);
        }
        response.status(200).send({ articles: articles });
    });
}

function postCommentToArticle(request, response) {
    async.waterfall([
        function (next) {
            articlesModel.findById(request.params.article_id, function (error, articles) {
                if (error) {
                    return next(error);
                }
                next(null, articles._id);
            });
        },
        function (id, done) {
            var comment = new commentsModel({
                body: request.body.body,
                belongs_to: id
            });
            comment.save(function (error, comment) {
                if (error) {
                    return done(error);
                }
                done(null, comment);
            });
            response.status(201).send({ comment: comment });
        }
    ], function (err) {
         if (err) {
            console.log(err);
        }
    });
}

function articleVote(request, response, next) {
    let query = {};
    if (request.query.vote === 'up') {
        query = { $inc: { votes: 1 } };
    }
    if (request.query.vote === 'down') {
        query = { $inc: { votes: -1 } };
    }
    articlesModel.update(request.params.article_id, query, function (error, article) {
        if (error) {
            return next(error);
        }
        next(null, article);
    });
    response.status(206).send({ article: 'VOTE REQUEST SUCCESSFUL' });
}

module.exports = {
    getArticlesByTopic: getArticlesByTopic,
    getAllArticles: getAllArticles,
    getArticleById: getArticleById,
    postCommentToArticle: postCommentToArticle,
    articleVote: articleVote
};