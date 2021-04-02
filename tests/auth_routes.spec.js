const request = require('supertest');
const app = require('../app.js');

// Hide console errors that are expected
beforeAll(async () => {
	jest.spyOn(console, 'error');
	// eslint-disable-next-line no-console
	console.error.mockImplementation(() => null);
});

// Return console error to original state
afterAll(async () => {
	// eslint-disable-next-line no-console
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
			.set('Authorization', `Bearer ${res.body.accessToken}`);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('username', 'user');
	});

	test('Sending incorrect JWT should not authorise', async () => {
		const invalidJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2MDAzQ0VNIEtvYSBTZXJ2ZXIiLCJhdWQiOiI2MDBDRU0gU1BBIiwic3ViIjo2LCJuYW1lIjoibm9uRXhpc3RlbnRVc2VyIiwicHJvdmlkZXIiOiJpbnRlcm5hbCIsImlhdCI6MTYxNzMzMzAyMSwiZXhwIjoxNjE3MzMzNjIxfQ.HZn4qlO5krZ4y6T5aBLSzXbeMjXzbr1sP6y55AJ5eWI';
		const res = await request(app.callback())
			.get('/api/v1/users/3')
			.set('Authorization', `Bearer ${invalidJwt}`);
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
			.post('/api/v1/auth/logout/')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('affectedRows', 1);
		expect(res.body.loggedOut).toBeTruthy();
	});
});
