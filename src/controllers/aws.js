// Load up Libraries
const AWS = require('aws-sdk');
const fs = require('fs');
//const dotenv = require('dotenv')

require('dotenv').config()

// These steps are used for netlify deployment of AWS Controller instead of reading .aws folder
const {ENV_AWS_ACCESS_KEY_ID, ENV_AWS_SECRET_ACCESS_KEY, ENV_DEFAULT_REGION} = process.env

AWS.config.update({
    accessKeyId: ENV_AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV_AWS_SECRET_ACCESS_KEY,
    region: ENV_DEFAULT_REGION
});

// Initate DynamoDB instance
var docClient = new AWS.DynamoDB.DocumentClient();

const grabData = async (tableName) => {
    /*
        grabData: Grab all data from Database
    */

    let params = {
        TableName: tableName,
    }

    let scanResults = [];
    let items;
    do{
        items =  await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");

    return scanResults;
}


const upload = (fname) => {
    /*
    upload: Upload new JSON file to Database.

    parameters:
    fname: Location for JSON file
    */
    let listingsData = JSON.parse(fs.readFileSync(fname, 'utf8'));
    listingsData.forEach((listing) => {
        let params = {
            TableName: 'Listings',
            Item: {
                "address": listing.address,
                "room" : listings.rooms,
                "city": listing.city,
                "state": listing.state,
                "price": listing.price,
                "floorSpace": listing.floorSpace,
                "extras": 
                {
                    "elevator": listing.extras.elevator,
                    "gym": listing.extras.gym,
                    "finished_basement": listing.extras.finished_basement,
                    "pool": listing.extras.pool
                },
                "homeType": listing.homeType,
                "image": listing.image
            }
        };

        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to add listing", listing.address, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Item succeeded:", data);
            }
        });
    });
}

// Define our exports
exports.upload = upload;
exports.grabData = grabData