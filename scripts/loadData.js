/* eslint-disable */

const db = connect('mongodb://localhost/issue-tracker');

db.dropDatabase();

// create the names collection and add documents to it
db.users.insert({
	username: 'admin1@test.com',
	password: '$2a$10$rDnDOnsPESjtAeIDVoGsMenut/NOZuLFtAGl0j5DcHXBgn4lOB4mu', // password is test1234
	firstName: 'admin1',
	lastName: 'admin1',
	createdTimestamp: new Date(),
	admin: true,
	activated: true
});
db.users.insert({
	username: 'user1@test.com',
	password: '$2a$10$rDnDOnsPESjtAeIDVoGsMenut/NOZuLFtAGl0j5DcHXBgn4lOB4mu', // password is test1234
	firstName: 'user1',
	lastName: 'user1',
	createdTimestamp: new Date(),
	admin: false,
	activated: true
});

db.users.insert({
	username: 'user2@test.com',
	password: '$2a$10$rDnDOnsPESjtAeIDVoGsMenut/NOZuLFtAGl0j5DcHXBgn4lOB4mu', // password is test1234
	firstName: 'user2',
	lastName: 'user2',
	createdTimestamp: new Date(),
	admin: false,
	activated: false
});

const admin1 = db.users.find()[0];

db.status.insertMany([
	{
		name: 'Pending',
		priority: 0,
		createdBy: admin1._id
	},
	{
		name: 'In Progress',
		priority: 1,
		createdBy: admin1._id
	},
	{
		name: 'Done',
		priority: 2,
		createdBy: admin1._id
	}
]);
