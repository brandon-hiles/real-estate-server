// 3rd party libraries
const express = require('express');
const serverless = require('serverless-http');

// Self Written Modules
const aws = require('./controllers/aws')

// Express Parameters
const app = express();
const router = express.Router();

// Routes
router.get('/', (req, res) => {
    res.json({
        'name' : 'Cedar Property Advisors API',
        'version' : '1.0.0',
        'author' : 'Brandon Hiles'
    });
});
router.get('/upload', (req, res) => res.send(aws.upload('./src/controllers/data/listingsData.json')))
router.get('/data', (req, res) => {
    let data = aws.grabData('Listings')
    data.then(result => res.json(result))
})


app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app);