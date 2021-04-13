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
	.execute('read')
	.on('messages');

ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('create')
	.on('message');

ac
	.grant('user')
	.condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
	.execute('delete')
	.on('message');

// Staff permissions
ac
	.grant('staff')
	.execute('read')
	.condition({
		Fn: 'OR',
		args: [
			{ Fn: 'EQUALS', args: { requester: '$.owner' } },
			{ Fn: 'EQUALS', args: { requesterLocation: '$.chatLocation' } }
		]
	}).on('messages');

ac
	.grant('staff')
	.execute('create')
	.condition({
		Fn: 'OR',
		args: [
			{ Fn: 'EQUALS', args: { requester: '$.owner' } },
			{ Fn: 'EQUALS', args: { requesterLocation: '$.chatLocation' } }
		]
	}).on('message');

ac
	.grant('staff')
	.execute('delete')
	.condition({
		Fn: 'OR',
		args: [
			{ Fn: 'EQUALS', args: { requester: '$.owner' } },
			{ Fn: 'EQUALS', args: { requesterLocation: '$.chatLocation' } }
		]
	}).on('message');

// Admin permissions
ac
	.grant('admin')
	.execute('read')
	.on('messages');

ac
	.grant('admin')
	.execute('create')
	.on('message');

ac
	.grant('admin')
	.execute('delete')
	.on('message');

/**
 * Function that checks permissions for seeing all messages for a chat.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.readMessages = async function readMessages(requester, data) {
	return ac
		.can(requester.role)
		.context({
			requester: requester.ID,
			owner: data.userID,
			requesterLocation: requester.locationID,
			chatLocation: data.locationID
		}).execute('read')
		.on('messages');
};

/**
 * Function that checks permissions for creating a new message to a chat.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} data - The user with ID that's to be retrieved from the database
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.createMessage = async function createMessage(requester, data) {
	return ac
		.can(requester.role)
		.context({
			requester: requester.ID,
			owner: data.userID,
			requesterLocation: requester.locationID,
			chatLocation: data.locationID
		}).execute('create')
		.on('message');
};

/**
 * Function that checks permissions for creating a new message to a chat.
 * @param {Object} requester - The authenticated user requesting access to the resource
 * @param {Object} message - The message that's to be deleted
 * @param {Object} chat - The chat that the message is from
 * @returns {Object} - A permissions Object that grants the user and filters the resource.
 */
exports.deleteMessage = async function deleteMessage(requester, message, chat) {
	return ac
		.can(requester.role)
		.context({
			requester: requester.ID,
			owner: message.senderID,
			requesterLocation: requester.locationID,
			chatLocation: chat.locationID
		}).execute('delete')
		.on('message');
};
