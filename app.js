const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json());

const { itemsRouter } = require('./routes/items');

app.use('/items', itemsRouter);

app.listen(3000, () => {
    console.log(`Listening on localhost:3000...`);
})

module.exports = app;