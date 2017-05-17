module.exports = {
    DB: {
        test: 'mongodb://localhost/northcoders-news-api-test',
        dev: 'mongodb://nc-news:password@ds143241.mlab.com:43241/nc-news-backend'
    },
    PORT: {
        test: 3090, 
        dev: process.env.PORT || 3000
    }
};