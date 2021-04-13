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

describe('Getting dogs', () => {
	test('get all 5 default dogs as guest', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(5);
	});

	test('get all 5 default dogs as authenticated user', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(5);
	});
});

describe('searching for dogs', () => {
	test('search by breed', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/?breed=poodle');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(1);
		expect(res.body[0]).toHaveProperty('name', 'Sophie');
		expect(res.body[0]).toHaveProperty('breed', 'Poodle');
	});

	test('search by name Phoebe', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/?name=Phoebe');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(2);
	});

	test('search by name and breed', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/?name=Phoebe&breed=Kelpie');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(1);
	});
});

describe('Get a single dog', () => {
	test('get a single dog as guest', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/1');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 1);
		expect(res.body).toHaveProperty('name', 'George');
	});

	test('get a single dog as an authenticated user', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/1')
			.auth('user', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 1);
		expect(res.body).toHaveProperty('name', 'George');
	});

	test('can not get non-existent dog', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/100');
		expect(res.statusCode).toEqual(404);
	});
});

describe('Add a new dog', () => {
	test('Unauthenticated user cannot add a dog', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs')
			.send({
				name: 'Stacy',
				age: 3,
				breed: 'Bulldog',
				description: 'A crazy bulldog.'
			});
		expect(res.statusCode).toEqual(401);
	});

	test('Regular authenticated user cannot add a dog', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs')
			.auth('user', 'password')
			.send({
				name: 'Stacy',
				age: 3,
				breed: 'Bulldog',
				description: 'A crazy bulldog.'
			});
		expect(res.statusCode).toEqual(403);
	});

	test('Authenticated staff can add a dog', async () => {
		const res = await request(app.callback())
			.post('/api/v1/dogs')
			.auth('staff', 'password')
			.send({
				name: 'Stacy',
				age: 3,
				breed: 'Bulldog',
				description: 'A crazy bulldog.'
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', 6);
		expect(res.body.created).toBeTruthy();
		expect(res.body).toHaveProperty('link');
	});
});

describe('Update a dog record', () => {
	test('cannot update non-existent dog', async () => {
		const res = await request(app.callback())
			.put('/api/v1/dogs/100')
			.auth('staff', 'password')
			.send({ name: 'nonExistentDog' });
		expect(res.statusCode).toEqual(404);
		expect(res.body.updated).toBeFalsy();
	});

	test('retrieve Stacy dog details', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/6');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 6);
		expect(res.body).toHaveProperty('name', 'Stacy');
	});

	test('different staff cannot change Stacy dog details', async () => {
		const res = await request(app.callback())
			.put('/api/v1/dogs/6')
			.auth('anotherStaff', 'password')
			.send({
				name: 'Annie',
				age: 1,
				breed: 'Pomeranian',
				description: 'A small pupper'
			});
		expect(res.statusCode).toEqual(403);
	});

	test('cannot update dog with empty request body', async () => {
		const res = await request(app.callback())
			.put('/api/v1/dogs/6')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(400);
	});

	test('original staff can change Stacy dog details', async () => {
		const res = await request(app.callback())
			.put('/api/v1/dogs/6')
			.auth('staff', 'password')
			.send({
				name: 'Annie',
				age: 1,
				breed: 'Pomeranian',
				description: 'A small pupper'
			});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('ID', '6');
		expect(res.body.updated).toBeTruthy();
		expect(res.body).toHaveProperty('link');
	});

	test('updated dog should have different details', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs/6');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('ID', 6);
		expect(res.body).toHaveProperty('name', 'Annie');
		expect(res.body).toHaveProperty('age', 1);
		expect(res.body).toHaveProperty('breed', 'Pomeranian');
	});
});

describe('Deleting a dog', () => {
	test('should not be able to delete non-existent dog', async () => {
		const res = await request(app.callback())
			.delete('/api/v1/dogs/100')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(404);
		expect(res.body.deleted).toBeFalsy();
	});

	test('different staff cannot delete dog at different shelter', async () => {
		const res = await request(app.callback())
			.delete('/api/v1/dogs/6')
			.auth('anotherStaff', 'password');
		expect(res.statusCode).toEqual(403);
	});

	test('there should be 6 dogs before deleting', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(6);
	});

	test('original staff can delete dog', async () => {
		const res = await request(app.callback())
			.delete('/api/v1/dogs/6')
			.auth('staff', 'password');
		expect(res.statusCode).toEqual(200);
		expect(res.body.deleted).toBeTruthy();
	});

	test('there should be 5 dogs after deleting', async () => {
		const res = await request(app.callback())
			.get('/api/v1/dogs');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveLength(5);
	});
});
