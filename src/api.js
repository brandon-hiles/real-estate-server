// 3rd party libraries
const express = require('express');
const path = require('path');
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
        'version' : '1.1.0',
        'author' : 'Brandon Hiles',
        'documentation': "./documentation"
    });
});
router.get('/documentation', (req, res) => {
    let page = 
    `<html>
        <head>
            <title> Documentation page </title>
        </head>
        <body>
        <h1> Documentation Page </h1>
        <table>
            <thead>
                <tr>
                    <th> Endpoints </th>
                    <th> URL Parameters </th>
                    <th> Request type </th>
                    <th> Description </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> ./upload/listings </td> 
                    <td> None </td>
                    <td> GET </td>
                    <td> This path is used for uploading our listings data file to AWS </td>
                </tr>
                <tr>
                    <td> ./upload/users </td>
                    <td> None </td>
                    <td> GET </td>
                    <td> This path is used for uploading our users data file to AWS </td>
                </tr>
                <tr>
                    <td> ./data/housing </td>
                    <td> None </td>
                    <td> GET </td>
                    <td> This path is used for recieving all housing data points from AWS </td>
                </tr>
                <tr>
                    <td> ./data/housing/:number </td>
                    <td> number: The number of data points </td>
                    <td> GET </td>
                    <td> This path is used for receiving a specific number of housing data points from AWS </td>
                </tr>
                <tr>
                    <td> ./data/users </td>
                    <td> None </td>
                    <td> GET </td>
                    <td> This path is used for recieving all users data points from AWS </td>
                </tr>
                <tr>
                    <td> ./data/users/:number </td>
                    <td> number: The number of data points </td>
                    <td> GET </td>
                    <td> This path is used for receiving a specific number of user data points from AWS </td>                    
                </tr>
            </tbody>
        </body>
    </html>`
    res.send(page)
})
router.post('/upload/listings', (req, res) => {
    // Upload Route: Upload our data file to AWS 
    aws.upload('./src/controllers/data/listingsData.json', 'Listings')
    res.send("Successful upload")
})
router.post('/upload/users', (req, res) => {
    // Upload Route: Upload our data file to AWS 
    aws.upload('./src/controllers/data/usersData.json', 'Users')
    res.send("Successful upload")
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