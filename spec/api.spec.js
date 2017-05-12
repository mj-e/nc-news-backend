process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');

const PORT = require('../config').PORT.test;
const ROOT = `http://localhost:${PORT}`;
require('../server');

mongoose.Promise = global.Promise;

describe('API ROUTES', () => {
    // Get some sample ids to use for future requests in the tests
    let sampleIds, invalidId, incorrectId;

    before(done => {
        mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase();
        });
        saveTestData((idObj) => {
            sampleIds = idObj;

            // also save some invalid IDs to test for errors
            // explain the difference between an invalid/incorrect ID
            invalidId = sampleIds.article_id.toString().split('');
            invalidId[invalidId.length - 1] = '5345';
            invalidId = invalidId.join('');

            // take an ID from another database
            incorrectId = '5841a06fed9db244975922c3';
            console.log('***************');
            console.log(sampleIds);
            console.log(incorrectId);
            console.log('***************');
            done();
        });
    });

    // Drop the database after test suite runs
    after(done => {
        mongoose.connection.db.dropDatabase(() => {
            done();
        });
    });
    describe('GET route not found', () => {
        it('returns ROUTE NOT FOUND and status 404', (done) => {
            request(`${ROOT}`)
                .get('/route-not-found')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(404);
                    expect(response.body.reason).to.equal('ROUTE NOT FOUND');
                    done();
                });
        });
    });
    describe('GET all articles /articles', () => {
        it('returns all articles ', (done) => {
            request(`${ROOT}`)
                .get('/articles')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('GET all articles by topic /topics', () => {
        it('returns all articles by topic', (done) => {
            request(`${ROOT}`)
                .get('/topics')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('GET all topics /topics', () => {
        it('returns all topics', (done) => {
            request(`${ROOT}`)
                .get('/topics')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('GET all articles by topics /topics/football/articles', () => {
        it('returns all football articles', (done) => {
            request(`${ROOT}`)
                .get('/topics/football/articles')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    expect(response.body.articles[0].belongs_to).to.equal('football');
                    done();
                });
        });
        it('returns all cat articles /topics/cats/articles', (done) => {
            request(`${ROOT}`)
                .get('/topics/cats/articles')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    expect(response.body.articles[0].belongs_to).to.equal('cats');
                    done();
                });
        });
    });
    describe('GET article by ID /articles/:article_id', () => {
        it('returns article by ID', (done) => {
            request(`${ROOT}`)
                .get(`/articles/${sampleIds.article_id}`)
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    expect(response.body.articles._id).to.equal(`${sampleIds.article_id}`);
                    done();
                });
        });
    });
    describe('GET article by ID comments /articles/:belongs_to/comments', () => {
        it('returns article by ID comments', (done) => {
            request(`${ROOT}`)
                .get(`/articles/${sampleIds.article_id}/comments`)
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    expect(response.body.comments[0].belongs_to).to.equal(`${sampleIds.article_id}`);
                    done();
                });
        });
    });
    describe('GET comments by comment ID /commments/:commment_id', () => {
        it('returns the comment by comment_id', (done) => {
            request(`${ROOT}`)
                .get(`/comments/${sampleIds.comment_id}`)
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.articles.body).to.equal('this is a comment');
                    done();
                });
        });
    });
    describe('POST comments to article by ID /articles/:article_id/comments', () => {
        it('POST comments to article by ID', (done) => {
            request(`${ROOT}`)
                .post(`/articles/${sampleIds.article_id}/comments`)
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(201);
                    expect(response.error).to.equal(false);
                    expect(response.body.comment.belongs_to).to.equal(`${sampleIds.article_id}`);
                    done();
                });
        });
    });
    describe('Increase article votes up /articles/:article_id/comments', () => {
        it('Increase article votes up', (done) => {
            request(`${ROOT}`)
                .put('/articles/58dd2c225eec68183cb2d872?vote=up')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(206);
                    expect(response.error).to.equal(false);
                    expect(response.body).to.eql({ 'article': 'VOTE REQUEST SUCCESSFUL' });
                    done();
                });
        });
    });
    describe('GET all comments /comments', () => {
        it('returns all comments ', (done) => {
            request(`${ROOT}`)
                .get('/comments')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('GET comments by ID /comments/:comment_id', () => {
        it('returns comments by ID ', (done) => {
            request(`${ROOT}`)
                .get(`/comments/${sampleIds.comment_id}`)
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    expect(response.body.articles.body).to.equal('this is a comment');
                    done();
                });
        });
    });
    describe('DELETE comment by ID /comments/:comment_id', () => {
        it('deletes comment by ID ', (done) => {
            request(`${ROOT}`)
                .delete('/comments/58dd2c225eec68183cb2d88b')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(204);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('Increase comment vote up /comments/:comment_id', () => {
        it('Increase comment votes up', (done) => {
            request(`${ROOT}`)
                .put('/comments/58dd2c225eec68183cb2d88b?vote=up')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(206);
                    expect(response.error).to.equal(false);
                    expect(response.body).to.eql({ 'comment': 'COMMENT VOTE REQUEST SUCCESSFUL' });
                    done();
                });
        });
    });
    describe('GET all users /users', () => {
        it('returns all users ', (done) => {
            request(`${ROOT}`)
                .get('/users')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });
    describe('GET user profile by username /users/:username', () => {
        it('returns user profile by username', (done) => {
            request(`${ROOT}`)
                .get('/users/tickle122')
                .end((error, response) => {
                    if (error) throw error;
                    expect(response.statusCode).to.equal(200);
                    expect(response.error).to.equal(false);
                    done();
                });
        });
    });

});
