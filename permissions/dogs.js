/**
 * A module to check permission for staff and admins interacting with dogs users in the database.
 * @module permissions/dogs
 * @author Abdullaahi Farah
 * @see permissions/* for other permissions in the API
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// User permissions - users have no permissions for dogs other than read
ac
	.grant('user')
	.execute('n/a')
	.on('n/a');

// Staff permissions
ac
	.grant('staff')
	.execute('create')
	.on('dog', ['*', '!ID', '!dateAdded']);

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.dog' } })
	.execute('update')
	.on('dog', ['*', '!ID', '!dateAdded']);

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.dog' } })
	.execute('delete')
	.on('dog');

// Admin permissions
ac
	.grant('admin')
	.execute('create')
	.on('dog');

ac
	.grant('admin')
	.execute('update')
	.on('dog');

ac
	.grant('admin')
	.execute('delete')
	.on('dog');

/**
 * Function that checks permissions for adding a dog to the database.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} dog - The dog with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.create = async function create(requester) {
	return ac
		.can(requester.role)
		.execute('create')
		.on('dog');
};

/**
 * Function that checks permissions for updating a dog's details.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} dog - The dog with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.update = async function update(requester, dog) {
	let { locationID } = dog;
	locationID = parseInt(locationID, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.locationID, dog: locationID })
		.execute('update')
		.on('dog');
};

/**
 * Function that checks permissions for deleting a dog to the database.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} dog - The dog with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.deleteDog = async function deleteDog(requester, dog) {
	let { locationID } = dog;
	locationID = parseInt(locationID, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.locationID, dog: locationID })
		.execute('delete')
		.on('dog');
};
