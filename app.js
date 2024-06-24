const express = require('express');

const app = express()



app.listen((port = 3000, host = 'localhost') => {
    console.log(`Listening on ${host}:${port}...`);
})