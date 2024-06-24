const express = require("express");
const itemsRouter = express.Router();
const dbItems = require('../fakeDb');

/**
 * Get the list of items from the database.
 */
itemsRouter.get('/', (req, res) => {
    // get and return all items from db
    return res.status(200).json({ 'items': dbItems });
});

/**
 * Add item to the database.
 */
itemsRouter.post('/', (req, res) => {

    try {

        const data = req.body || {};

        // get data from request body
        const itemName = data.name || '';
        const itemPrice = data.price || 0.0;

        // data validation
        const errorMessages = [];
        if (!itemName) errorMessages.push('Item Name "name" is required.');
        if (!itemPrice) errorMessages.push('Item Price "price" is required.');
        if (errorMessages.length) return res.status(400).json({ 'errors': errorMessages });

        // else persist to "database"
        const item = { 'name': itemName, 'price': itemPrice };
        dbItems.push(item);

        // return response
        return res.status(201).json({ 'added': item })

    } catch (err) {
        console.log(err);
        throw err;
    }

});

/**
 * Get item from database by given name.
 */
itemsRouter.get('/:name', (req, res) => {
    const name = req.params.name || '';

    const item = _getItem(name);

    if (item) return res.status(200).json(item);
    else return res.status(404).json({ 'Error': 'Item not found.', 'name': name });

});

/**
 * Update item from database by given name.
 */
itemsRouter.patch('/:name', (req, res) => {

    // check if item name
    const name = req.params.name;

    // get item by name (in this case removing because of possibly editing name)
    const item = _removeItem(name);

    if (!item) return res.status(404).json({ 'Error': 'Item not found.', 'name': name })

    // get new item attributes from request body
    const newName = req.body.name || name;
    const newPrice = req.body.price || item.price;

    const newItem = { 'name': newName, 'price': newPrice };

    dbItems.push(newItem);

    return res.status(200).json({ 'updated': newItem })
});

/**
 * Delete item from database by given name.
 */
itemsRouter.delete('/:name', (req, res) => {
    const name = req.params.name;

    const item = _removeItem(name);

    if (item) return res.status(200).json({ 'message': 'deleted' });
    else return res.status(404).json({ 'message': 'not found' });
});

/**
 * Attempts to retrieve an item from the database.
 * @param {string} name - the name of the product to query 
 * @returns the item if exists, else null
 */
function _getItem(name) {

    let item = null;

    const itemsByName = dbItems.filter((e) => e['name'] = name)

    if (itemsByName.length) item = itemsByName[0];

    return item;
}

/**
 * Attempts to remove the item from the database (for update and delete)
 * @param {string} name the name of the item to remove. 
 * @returns the removed item if found, else null.
 */
function _removeItem(name) {

    let item = null;

    // get item from db
    item = _getItem(name);

    if (item) {
        // update dbItems with removed item
        const idx = dbItems.indexOf(item);
        dbItems.splice(idx, 1);
    }

    return item;
}

module.exports = { itemsRouter, _getItem, _removeItem };