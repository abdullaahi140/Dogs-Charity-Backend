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

describe('Get a single location', () => {
	test('get the Animal Rescue shelter', async () => {
		const res = await request(app.callback())
			.get('/api/v1/locations/2')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 2);
	});
});

describe('Getting all locations', () => {
	test('there should be 1 location for default user', async () => {
		const res = await request(app.callback())
			.get('/api/v1/locations')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(1);
	});
});
