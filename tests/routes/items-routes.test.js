const dbItems = require('../../fakeDb');
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");


describe("GET /items", function () {

    beforeEach(() => {
        dbItems.forEach((x) => {
            dbItems.pop();
        })
    });

    test("Gets an empty list", async function () {
        const resp = await request(app).get(`/items/`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({ items: [] });
    });

    test("Gets a list of items", async function () {

        // add item to fakeDB
        dbItems.push({ 'name': 'product1', 'price': 1.11 });


        const resp = await request(app).get(`/items/`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual({ items: [{ 'name': 'product1', 'price': 1.11 }] });
    });
});


describe("POST /items", function () {
    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test("Posts a valid item", async function () {

        const itemToPost = { 'name': 'posted_product1', 'price': 2.34 };

        const resp = await request(app).post(`/items/`).send(itemToPost);
        expect(resp.statusCode).toBe(201);

        expect(resp.body).toEqual({ 'added': itemToPost });
    });

    test("Posts an invalid item", async function () {
        const resp = await request(app).post(`/items/`).send({});
        expect(resp.statusCode).toBe(400);

        expect(resp.body).toEqual({ 'errors': ['Item Name "name" is required.', 'Item Price "price" is required.'] });
    });
});


describe("GET /items/:name", function () {
    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test("Gets a valid item", async function () {

        const itemToTest = { 'name': 'product1', 'price': 1.12 };

        dbItems.push(itemToTest);

        const resp = await request(app).get(`/items/product1`);
        expect(resp.statusCode).toBe(200);

        expect(resp.body).toEqual(itemToTest);
    });

    test("Gets an item that does not exist", async function () {

        const name = 'product1';

        const resp = await request(app).get(`/items/` + name);
        expect(resp.statusCode).toBe(404);

        expect(resp.body).toEqual({ 'Error': 'Item not found.', 'name': name });
    });
});

describe("PATCH /items/:name", function () {
    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test("Patches a valid item", async function () {

        const itemToPost = { 'name': 'posted_product1', 'price': 2.34 };
        const newItem = { 'name': 'posted_product1', 'price': 1.23 };

        dbItems.push(itemToPost);

        const resp = await request(app).patch(`/items/` + itemToPost.name).send(newItem);
        expect(resp.statusCode).toBe(200);

        expect(dbItems.length).toEqual(1);
        expect(resp.body).toEqual({ 'updated': newItem });
    });

    test("Patches an invalid item", async function () {

        expect(dbItems.length).toEqual(0);

        const newItem = { 'name': 'product5', 'price': 1.23 };

        const resp = await request(app).patch(`/items/` + newItem.name).send(newItem);
        expect(resp.statusCode).toBe(404);

        expect(resp.body).toEqual({ 'Error': 'Item not found.', 'name': newItem.name });
    });
});

describe("DELETE /items/:name", function () {
    beforeEach(() => {
        while (dbItems.length) dbItems.pop();
    });

    test("Deletes a valid item", async function () {

        const itemToPost = { 'name': 'posted_product1', 'price': 2.34 };

        dbItems.push(itemToPost);

        const resp = await request(app).delete(`/items/` + itemToPost.name);
        expect(resp.statusCode).toBe(200);

        expect(dbItems.length).toEqual(0);
        expect(resp.body).toEqual({ 'message': 'deleted' });
    });

    test("Deletes an item that doesn't exist", async function () {


        const newItem = { 'name': 'product5', 'price': 1.23 };

        const resp = await request(app).delete(`/items/` + newItem.name);
        expect(resp.statusCode).toBe(404);

        expect(resp.body).toEqual({ 'message': 'not found' });
    });
});