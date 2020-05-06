# Real Estate Server

This repo is the backend API for the real-estate application (https://github.com/brandon-hiles/real-estate-app). This API is written in javascript (ES6) and utilizes the express framework + AWS + netlify.

Live Link: https://stupefied-mccarthy-ecaf46.netlify.app/.netlify/functions/api/

## Structure of API
This API is built to utilize netlify-lambda functions for easy deployment on their Docker containers as noted in the scripts tag in package.json. All source code is found in the ./src directory with the main server file being contained within api.js file.