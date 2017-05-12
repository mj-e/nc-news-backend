const express = require('express');
const router = express.Router();
const articleControllers = require('../controllers/articlesController');
const commentControllers = require('../controllers/commentsController');
const usersController = require('../controllers/usersController');

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

router.route('/articles').get(articleControllers.getAllArticles);

router.route('/topics/:belongs_to/articles').get(articleControllers.getArticlesByTopic);

router.route('/articles/:article_id').get(articleControllers.getArticleById);

router.route('/articles/:article_id/comments').post(articleControllers.postCommentToArticle);

router.route('/articles/:article_id').put(articleControllers.articleVote);

router.route('/articles/:belongs_to/comments').get(commentControllers.getCommentsByArticle);

router.route('/comments').get(commentControllers.getAllComments);

router.route('/comments/:comment_id').get(commentControllers.getCommentById);

router.route('/comments/:comment_id').delete(commentControllers.deleteCommentById);

router.route('/comments/:comment_id').put(commentControllers.commentVote);

router.route('/users').get(usersController.getAllUsers);

router.route('/users/:username').get(usersController.getUserProfile);


module.exports = router;