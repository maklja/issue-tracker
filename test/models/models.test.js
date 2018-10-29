const assert = require('assert');
const mongoose = require('mongoose');

const { createConnection } = require('../../src/db');
const User = require('../../src/model/User');
const Status = require('../../src/model/Status');
const Issue = require('../../src/model/Issue');

const testDB = 'mongodb://localhost/issue-tracker-test';
let dbConnection = null;

describe('User model test', () => {
	before(done => {
		// create connection to the database
		createConnection(testDB)
			.then(connection => {
				dbConnection = connection;
				done();
			})
			.catch(err => done(err));
	});

	beforeEach(done => {
		const { users } = dbConnection.collections;

		// drop all collections
		users
			.drop()
			.then(() => done())
			.catch(() => done()); // if collection doesn't exits promise will be rejected, bu continue anyway
	});

	it('save new user to database successfully', done => {
		const password = 'test1234';
		const newUser = new User({
			email: 'test@gmail.com',
			password,
			firstName: 'TestFirstName',
			lastName: 'TestLastName'
		});

		newUser
			.save()
			.then(user => {
				assert(user._id != null); // new user must have id
				assert(user.password !== password); // password must be encrypted

				// check password match using decrypt
				user.checkPassword(password)
					.then(isMatch => {
						assert(isMatch);
						done();
					})
					.catch(err => done(err));
			})
			.catch(err => done(err));
	});
});

describe('Status model test', () => {
	before(done => {
		// create connection to the database
		createConnection(testDB)
			.then(connection => {
				dbConnection = connection;
				done();
			})
			.catch(err => done(err));
	});

	beforeEach(done => {
		const { status } = dbConnection.collections;

		// drop all collection
		status
			.drop()
			.then(() => done())
			.catch(() => done()); // if collection doesn't exits promise will be rejected, bu continue anyway
	});

	it('save new status to database successfully', done => {
		const newStatus = new Status({
			name: 'New',
			priority: 1,
			createdBy: mongoose.Types.ObjectId() // user id that created status
		});

		newStatus
			.save()
			.then(status => {
				assert(status._id != null);
				done();
			})
			.catch(err => done(err));
	});
});

describe('Issue model test', () => {
	before(done => {
		// create connection to the database
		createConnection(testDB)
			.then(connection => {
				dbConnection = connection;
				done();
			})
			.catch(err => done(err));
	});

	beforeEach(done => {
		const { issues } = dbConnection.collections;

		// drop all collection
		issues
			.drop()
			.then(() => done())
			.catch(() => done()); // if collection doesn't exits promise will be rejected, bu continue anyway
	});

	it('save new issue to database successfully', done => {
		const userId = mongoose.Types.ObjectId(); // user id that reported issue
		const statusId = mongoose.Types.ObjectId(); // default status
		const newIssue = new Issue({
			title: 'New issue',
			content: 'Too many bugs',
			reportedBy: userId,
			status: statusId
		});

		newIssue
			.save()
			.then(issue => {
				assert(issue._id != null);
				done();
			})
			.catch(err => done(err));
	});
});
