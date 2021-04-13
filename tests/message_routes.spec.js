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

describe('Getting all messages', () => {
	test('User can see all messages for a chat', async () => {
		const res = await request(app.callback())
			.get('/api/v1/messages/1')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(4);
	});

	test('Staff can see all messages for a chat', async () => {
		const res = await request(app.callback())
			.get('/api/v1/messages/1')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(4);
	});

	test('Different user can not see all messages for different chats', async () => {
		const res = await request(app.callback())
			.get('/api/v1/messages/1')
			.auth('anotherUser', 'password');
		expect(res.statusCode).toEqual(403);
	});
});

describe('Creating messages', () => {
	test('User can create message for their chat', async () => {
		const res = await request(app.callback())
			.post('/api/v1/messages/1')
			.auth('user', 'password')
			.send({ message: 'Hello!' });
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', 5);
		expect(res.body.created).toBeTruthy();
	});

	test('Staff can respond with a message for chat with shelter', async () => {
		const res = await request(app.callback())
			.post('/api/v1/messages/1')
			.auth('staff', 'password')
			.send({ message: 'Bye!' });
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', 6);
		expect(res.body.created).toBeTruthy();
	});

	test('Another user can not create message for a chat not their own', async () => {
		const res = await request(app.callback())
			.post('/api/v1/messages/1')
			.auth('anotherUser', 'password')
			.send({ message: 'Hello!' });
		expect(res.statusCode).toEqual(403);
	});

	test('Staff at different shelter can can not respond to message in chat', async () => {
		const res = await request(app.callback())
			.post('/api/v1/messages/1')
			.auth('anotherStaff', 'password')
			.send({ message: 'Hello!' });
		expect(res.statusCode).toEqual(403);
	});

	test('User can not create message non-existent chat', async () => {
		const res = await request(app.callback())
			.post('/api/v1/messages/100')
			.auth('user', 'password')
			.send({ message: 'Hello!' });
		expect(res.statusCode).toEqual(404);
		expect(res.body.created).toBeFalsy();
	});
});

describe('Deleting messages', () => {
	// TODO: Keep going
	test('User can delete message', async () => {
		const res = await request(app.callback())
			.del('/api/v1/messages/1')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});

	test("User can not delete staff's message", async () => {
		const res = await request(app.callback())
			.del('/api/v1/messages/2')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(403);
	});

	test("Staff can delete user's message", async () => {
		const res = await request(app.callback())
			.del('/api/v1/messages/3')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});

	test('User can not delete non-existent message', async () => {
		const res = await request(app.callback())
			.del('/api/v1/messages/100')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(404);
	});
});
