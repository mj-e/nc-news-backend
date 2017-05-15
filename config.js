module.exports = {
    DB: {
        test: 'mongodb://localhost/northcoders-news-api-test',
        dev: 'mongodb://nc-news:password@ds137121.mlab.com:37121/nc-news-backend'
    },
    PORT: {
        test: 3090, 
        dev: 3000
    }
};
// mongodb://<dbuser>:<dbpassword>@ds137121.mlab.com:37121/nc-news-backend