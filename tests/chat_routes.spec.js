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

describe('Getting all chats', () => {
	test('Unauthorised user does not have chats', async () => {
		const res = await request(app.callback())
			.get('/api/v1/chats');
		expect(res.statusCode).toEqual(401);
	});

	test('default user should have 1 active chat', async () => {
		const res = await request(app.callback())
			.get('/api/v1/chats')
			.auth('user', 'password');
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toHaveProperty('userID', 3);
	});

	test('staff can see all chats for a shelter', async () => {
		const res = await request(app.callback())
			.get('/api/v1/chats/2')
			.auth('staff', 'password');
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toHaveProperty('locationID', 2);
	});

	test('users cannot see all chats for a shelter', async () => {
		const res = await request(app.callback())
			.get('/api/v1/chats/2')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(403);
	});
});

describe('Creating chats', () => {
	test('Unauthorised user can not create chats', async () => {
		const res = await request(app.callback())
			.post('/api/v1/chats/2');
		expect(res.statusCode).toEqual(401);
	});

	test('Another user can create a chat with a shelter', async () => {
		const res = await request(app.callback())
			.post('/api/v1/chats/2')
			.auth('anotherUser', 'password');
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', 2);
		expect(res.body.created).toBeTruthy();
		expect(res.body).toHaveProperty('link');
	});

	test('User can create a chat with a different shelter', async () => {
		const res = await request(app.callback())
			.post('/api/v1/chats/3')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', 3);
		expect(res.body.created).toBeTruthy();
		expect(res.body).toHaveProperty('link');
	});

	test('user can not create another chat with the same shelter', async () => {
		const res = await request(app.callback())
			.post('/api/v1/chats/2')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(404);
		expect(res.body.created).toBeFalsy();
	});
});

describe('Deleting chats', () => {
	test('Unauthorised user can not delete chats', async () => {
		const res = await request(app.callback())
			.del('/api/v1/chats/1');
		expect(res.statusCode).toEqual(401);
	});

	test('user can delete their own chat', async () => {
		const res = await request(app.callback())
			.del('/api/v1/chats/3')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});

	test("user can not delete another user's chat", async () => {
		const res = await request(app.callback())
			.del('/api/v1/chats/2')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(403);
	});

	test('user can not delete non-existent chat', async () => {
		const res = await request(app.callback())
			.del('/api/v1/chats/100')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(404);
	});

	test('staff can delete a chat for their shelter', async () => {
		const res = await request(app.callback())
			.del('/api/v1/chats/2')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});
});
