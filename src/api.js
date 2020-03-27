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
        'version' : '1.0.1',
        'author' : 'Brandon Hiles'
    });
});
router.get('/documentation', (req, res) => {
    res.send("Insert documentation page here")
})
router.get('/upload/listings', (req, res) => {
    // Upload Route: Upload our data file to AWS 
    res.send(aws.upload('./src/controllers/data/listingsData.json', 'Listings'))
})
router.get('/upload/users', (req, res) => {
    // Upload Route: Upload our data file to AWS 
    res.send(aws.upload('./src/controllers/data/usersData.json', 'Users'))
})
router.get('/data/housing', (req, res) => {
    // Display Route: Display our data from DynamboDB Database
    let data = aws.grabData('Listings')
    data.then(result => res.json(result))
})
router.get('/data/housing/:number', (req, res) => {
    // Filtered Data Route: Display number amount of results from DynamboDB
    let data = aws.grabData('Listings')
    data.then(result => {
        let filteredData = result.slice(0, req.params.number)
        res.json(filteredData)
    })
})
router.get('/data/users', (req, res) => {
    let data = aws.grabData('Users')
    data.then(result => res.json(result))
})
router.get('/data/users/:number', (req, res) => {
    let data = aws.grabData('Users')
    data.then(result => {
        let filteredData = result.slice(0, req.params.number)
        res.json(filteredData)
    })
})
// Netlfiy configurations
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app);