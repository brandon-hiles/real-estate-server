// 3rd party libraries
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Self Written Modules
const aws = require('./controllers/aws')

// Express Parameters
const app = express();
app.use(cors());

const router = express.Router();

// Routes
router.get('/', (req, res) => {
    // Root Route: Display information about our server
    res.json({
        'name' : 'Cedar Property Advisors API',
        'version' : '1.0.0',
        'author' : 'Brandon Hiles'
    });
});
router.get('/upload', (req, res) => {
    // Upload Route: Upload our data file to AWS 
    res.send(aws.upload('./src/controllers/data/listingsData.json'))
})
router.get('/data', (req, res) => {
    // Display Route: Display our data from DynamboDB Database
    let data = aws.grabData('Listings')
    data.then(result => res.json(result))
})
router.get('/data/:number', (req, res) => {
    // Filtered Data Route: Display number amount of results from DynamboDB
    let data = aws.grabData('Listings')
    data.then(result => {
        let filteredData = result.slice(0, req.params.number)
        res.json(filteredData)
    })
})

// Netlfiy configurations
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app);