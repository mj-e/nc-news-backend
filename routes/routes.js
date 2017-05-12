const express = require('express');
const router = express.Router();
const articleControllers = require('../controllers/articlesController');

router.route('/').get(function (request, response) {
  response.status(200).send({status: 'OK'});
});

router.route('/articles').get(articleControllers.getAllArticles);

router.route('/topics/:belongs_to/articles').get(articleControllers.getArticlesByTopic);

router.route('/articles/:article_id').get(articleControllers.getArticleById);

router.route('/articles/:article_id/comments').post(articleControllers.postCommentToArticle);

router.route('/articles/:article_id').put(articleControllers.articleVote);

module.exports = router;