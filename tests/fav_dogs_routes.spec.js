const request = require('supertest');
const app = require('../app.js');

/* eslint-disable no-console */
// Hide console errors that are expected
beforeAll(async () => {
	jest.spyOn(console, 'error');
	console.error.mockImplementation(() => null);
});

// Return console error to original state
afterAll(async () => {
	console.error.mockRestore();
});

describe('Checking dogs as favourites', () => {
	test('Dog ID 1 should be favourited for user', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs/1')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.favourite).toBeTruthy();
	});

	test('Dog ID 5 should not be favourited for user', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs/5')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(404);
		expect(res.body.favourite).toBeFalsy();
	});
});

describe('Getting favourite dogs', () => {
	test('example user should have 3 favourite dogs', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(3);
	});

	test('admin should have 0 favourite dogs', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('admin', 'admin');
		expect(res.statusCode).toBe(404);
	});
});

describe('Adding dogs as favourites', () => {
	test('unauthenticated user cannot favourite dog', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs/favs/1');
		expect(res.statusCode).toEqual(401);
	});

	test('staff should have 1 favourite dog', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(1);
	});

	test('staff user can favourite dog', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs/favs/1')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(201);
		expect(res.body.created).toBeTruthy();
	});

	test('staff user cannot favourite same dog again', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs/favs/1')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(404);
	});

	test('staff should have 2 favourite dogs', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(2);
	});
});

describe('Removing favourites from dogs', () => {
	test('unauthenticated user cannot remove favourite dog', async () => {
		const res = await request(app.callback())
			.del('/api/v1/dogs/favs/1');
		expect(res.statusCode).toEqual(401);
	});

	test('example user should have 3 favourite dogs before removal', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(3);
	});

	test('example user can remove favourite on dog', async () => {
		const res = await request(app.callback())
			.del('/api/v1/dogs/favs/1')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});

	test('example user should have 2 favourite dogs after removal', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/favs')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(2);
	});

	test('example cannot remove favourite on non-favourite dog', async () => {
		const res = await request(app.callback())
			.del('/api/v1/dogs/favs/5')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(404);
		expect(res.body.deleted).toBeFalsy();
	});
});
