const { _getItem, _removeItem } = require('../../routes/items');
const dbItems = require('../../fakeDb');

describe('_getItem', () => {

    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test('get existing item', () => {

        // add item to fakeDB
        dbItems.push({ 'name': 'product1', 'price': 1.11 });

        const itemToTest = _getItem('product1');

        expect(itemToTest).not.toBe(null);
        expect(itemToTest.name).toBe('product1');
        expect(itemToTest.price).toBe(1.11);
        expect(dbItems.length).toBe(1);
    })

    test('get item that does not exist', () => {
        const itemToTest = _getItem('product1');
        expect(itemToTest).toBe(null);
        expect(dbItems.length).toBe(0);
    })
})

describe('_removeItem', () => {

    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test('remove existing item', () => {

        // add item to fakeDB
        dbItems.push({ 'name': 'product1', 'price': 1.11 });

        expect(dbItems.length).toBe(1);

        const itemToTest = _removeItem('product1');

        expect(itemToTest).not.toBe(null);
        expect(itemToTest.name).toBe('product1');
        expect(itemToTest.price).toBe(1.11);
        expect(dbItems.length).toBe(0);
    })

    test('remove item that does not exist', () => {
        expect(dbItems.length).toBe(0);
        const itemToTest = _removeItem('product1');
        expect(dbItems.length).toBe(0);
        expect(itemToTest).toBe(null);
    })

});
