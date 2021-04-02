/* eslint-disable no-console */
const request = require('supertest');
const app = require('../app.js');
require('dotenv').config();

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

describe('Getting users', () => {
	test('get all 3 defualt users', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(3);
	});

	test('non-admin user should not see all users', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(403);
	});

	test('should not get non-existent account', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/100')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(404);
	});
});

describe('Get a single user', () => {
	test('admin user should exist and have admin role', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/1')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 1);
		expect(res.body).toHaveProperty('username', 'admin');
		expect(res.body).toHaveProperty('role', 'admin');
	});

	test('admins can see other users', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/2')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 2);
		expect(res.body).toHaveProperty('username', 'staff');
	});

	test('non-admin user can not see other users', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/1')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(403);
	});
});

describe('Create a new user', () => {
	test('should create a new user', async () => {
		const res = await request(app.callback())
			.post('/api/v1/users')
			.send({
				username: 'example',
				password: 'password'
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body.created).toBeTruthy();
		expect(res.body).toHaveProperty('accessToken');
	});

	test('new user should have user role', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/4')
			.auth('example', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 4);
		expect(res.body).toHaveProperty('username', 'example');
		expect(res.body).toHaveProperty('role', 'user');
	});

	test('create a staff user', async () => {
		const res = await request(app.callback())
			.post('/api/v1/users')
			.send({
				username: 'exampleStaff',
				password: 'staffPassword',
				staffCode: process.env.STAFF_CODE
			});
		const checkRole = await request(app.callback())
			.get('/api/v1/users/5')
			.auth('exampleStaff', 'staffPassword');
		expect(res.statusCode).toEqual(201);
		expect(res.body.created).toBeTruthy();
		expect(res.body).toHaveProperty('accessToken');
		expect(checkRole.statusCode).toEqual(200);
		expect(checkRole.body).toHaveProperty('role', 'staff');
	});

	test('should not be able to create duplicate accounts', async () => {
		const res = await request(app.callback())
			.post('/api/v1/users')
			.send({
				username: 'example',
				password: 'password'
			});
		expect(res.statusCode).toEqual(404);
		expect(res.body.created).toBeFalsy();
	});
});

describe('Update user account', () => {
	test('retrieve example user original details', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/4')
			.auth('example', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('username', 'example');
	});

	test('update example user', async () => {
		const res = await request(app.callback())
			.put('/api/v1/users/4')
			.auth('example', 'password')
			.send({
				username: 'updatedUser',
				password: 'newPassword'
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body.updated).toBeTruthy();
	});

	test("user cannot update another user's details", async () => {
		const res = await request(app.callback())
			.put('/api/v1/users/4')
			.auth('user', 'password')
			.send({
				username: 'updatedUser',
				password: 'newPassword'
			});
		expect(res.statusCode).toEqual(403);
	});

	test('updated user should have different username', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users/4')
			.auth('updatedUser', 'newPassword');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('username', 'updatedUser');
	});
});

describe('Deleting user account', () => {
	test('there should be 5 accounts before deleting', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(5);
	});

	test('delete a user account', async () => {
		const res = await request(app.callback())
			.delete('/api/v1/users/4')
			.auth('updatedUser', 'newPassword');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', '4');
		expect(res.body.deleted).toBeTruthy();
	});

	test('there should be 4 accounts after deleting', async () => {
		const res = await request(app.callback())
			.get('/api/v1/users')
			.auth('admin', 'admin');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(4);
	});

	test("user cannot delete another user's account", async () => {
		const res = await request(app.callback())
			.delete('/api/v1/users/4')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(403);
	});
});
