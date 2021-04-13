/**
 * A module to check permission for chats in the API.
 * @module permissions/chats
 * @author Abdullaahi Farah
 * @see permissions/* for other permissions in the API
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// User permissions
ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('delete')
	.on('chat');

// Staff permissions
ac
	.grant('staff')
	.condition({
		Fn: 'OR',
		args: [
			{ Fn: 'EQUALS', args: { requester: '$.owner' } },
			{ Fn: 'EQUALS', args: { requesterLocation: '$.chatLocation' } }
		]
	})
	.execute('delete')
	.on('chat');

ac
	.grant('staff')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('read')
	.on('chats');

// Admin permissions
ac
	.grant('admin')
	.execute('read')
	.on('chats');

ac
	.grant('admin')
	.execute('delete')
	.on('chat');

/**
 * Function that checks permissions for seeing all chat for a shelter location.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.readByLocationId = async function readByLocationId(requester, data) {
	let { locationID } = data;
	locationID = parseInt(locationID, 10);
	return ac
		.can(requester.role)
		.context({ requester: requester.locationID, owner: locationID })
		.execute('read')
		.on('chats');
};

/**
 * Function that checks permissions for deleting a chat.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.deleteChat = async function deleteChat(requester, data) {
	return ac
		.can(requester.role)
		.context({
			requester: requester.ID,
			owner: data.userID,
			requesterLocation: requester.locationID,
			chatLocation: data.locationID
		})
		.execute('delete')
		.on('chat');
};
