const functions = require('firebase-functions');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Firebase Functions!');
});

exports.app = functions.https.onRequest(app);