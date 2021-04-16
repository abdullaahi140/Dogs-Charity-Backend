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

describe('Getting images', () => {
	test('Get an image', async () => {
		const res = await request(app.callback())
			.get('/api/v1/images/1');
		expect(res.statusCode).toEqual(200);
	});

	test('Can not get non-existent image', async () => {
		const res = await request(app.callback())
			.get('/api/v1/images/100');
		expect(res.statusCode).toEqual(404);
	});
});
