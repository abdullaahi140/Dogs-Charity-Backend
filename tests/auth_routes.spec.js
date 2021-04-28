const request = require('supertest');
const app = require('../app.js');
const { genJwtAccessToken } = require('../helpers/jwtToken.js');

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

describe('Authenticating users using username and password', () => {
	test('Internal users can log in using credentials', async () => {
		const res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('accessToken');
	});

	test('Internal users must have correct username to log in', async () => {
		const res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('wrongUsername', 'wrongPassword');
		expect(res.statusCode).toEqual(401);
	});

	test('Internal users must have correct password to log in', async () => {
		const res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('staff', 'wrongPassword');
		expect(res.statusCode).toEqual(401);
	});
});

describe('Authenticating users using JWT', () => {
	test('retrieve user original details using JWT', async () => {
		let res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('user', 'password');

		res = await request(app.callback())
			.get('/api/v1/users/3')
			.set('Authorization', `Bearer ${res.body.accessToken.token}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('username', 'user');
	});

	test('Sending incorrect JWT should not authorise', async () => {
		const invalidJWT = await genJwtAccessToken(100, 'nonExistentUser');
		const res = await request(app.callback())
			.get('/api/v1/users/2')
			.set('Authorization', `Bearer ${invalidJWT}`);
		expect(res.statusCode).toEqual(401);
	});

	test('Access tokens can be refreshed', async () => {
		let res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('user', 'password');

		res = await request(app.callback())
			.get('/api/v1/auth/refresh/3')
			.set('Authorization', `Bearer ${res.body.accessToken}`);

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('accessToken');
	});

	test('Unauthenticated users can not refresh tokens', async () => {
		const res = await request(app.callback())
			.get('/api/v1/auth/refresh/1')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(404);
	});
});

describe('Log out user', () => {
	test('Internal users can log in using credentials', async () => {
		const res = await request(app.callback())
			.post('/api/v1/auth/login')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('accessToken');
	});

	test('Log out authenticated user', async () => {
		const res = await request(app.callback())
			.post('/api/v1/auth/logout')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('affectedRows', 1);
		expect(res.body.loggedOut).toBeTruthy();
	});
});
