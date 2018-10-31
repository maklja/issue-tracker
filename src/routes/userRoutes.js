const express = require('express');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const User = require('../model/User');
const { ensureNotAuthenticated, ensureIsAdmin } = require('./middlewares');

router.delete(
	'/user',
	ensureIsAdmin,
	[
		check('id')
			.exists()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { id } = req.body;

		try {
			const result = await User.aggregate([
				{ $match: { _id: ObjectID(id) } },
				{
					$lookup: {
						from: 'issues',
						localField: '_id',
						foreignField: 'reportedBy',
						as: 'userReportedIssues'
					}
				},
				{
					$project: {
						_id: 0,
						userReportedIssuesNumber: {
							$size: '$userReportedIssues'
						}
					}
				}
			]).exec();

			if (result[0].userReportedIssuesNumber > 0) {
				resp.status(403).json({
					error: 'HAS_REPORTED_ISSUES'
				});
				return;
			}

			// can't delete it own account
			if (id === req.user._id) {
				resp.status(400).json({
					error: 'INVALID_ACCOUNT'
				});
				return;
			}
			// do a hard delete only
			await User.deleteOne({ _id: id });

			resp.status(204).send();
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

router.post(
	'/activate-user',
	ensureIsAdmin,
	[
		check('id')
			.exists()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { id } = req.body;

		try {
			await User.updateOne(
				{ _id: id },
				{
					activated: true
				}
			);

			resp.status(204).send();
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

router.get('/users', ensureIsAdmin, async (req, resp) => {
	try {
		const users = await User.aggregate([
			{
				$project: {
					_id: 1,
					username: 1,
					firstName: 1,
					lastName: 1,
					createdTimestamp: 1,
					admin: 1,
					activated: 1
				}
			}
		])
			.sort({ createdTimestamp: -1 })
			.exec();

		resp.json(users);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.get('/init', (req, resp) => {
	const { user } = req;
	if (user) {
		// return user information if user is logged in
		resp.json({
			user: {
				_id: user._id,
				username: user.username,
				admin: user.admin
			}
		});
	} else {
		resp.json({
			user: null
		});
	}
});

router.post(
	'/login',
	ensureNotAuthenticated,
	[
		check('username')
			.isLength({ min: 5 })
			.isEmail(),
		check('password')
			.isLength({ min: 5 })
			.isString()
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		passport.authenticate('local', (err, user) => {
			if (err) {
				return next(err);
			}

			// if login in not successful just return null to client as
			// indicator that login failed
			if (!user) {
				return res.json({
					user: null
				});
			}

			// login user
			req.logIn(user, err => {
				if (err) {
					return next(err);
				}

				const { _id, username, admin } = user;

				// send user data to the client
				return res.json({
					user: {
						_id,
						username,
						admin
					}
				});
			});
		})(req, res, next);
	}
);

router.post('/logout', (req, res) => {
	req.logout(); // delete session
	res.status(204).json(); // sent just confirmed status code without body
});

router.post(
	'/register',
	ensureNotAuthenticated,
	[
		check('username')
			.isLength({ min: 5 })
			.isEmail(),
		check('password')
			.isLength({ min: 5 })
			.isString(),
		check(
			'repeatPassword',
			'repeatPassword field must have the same value as the password field'
		)
			.exists()
			.custom((value, { req }) => value === req.body.password),
		check('firstName')
			.isLength({ min: 5 })
			.isString(),
		check('lastName')
			.isLength({ min: 5 })
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { username, password, firstName, lastName } = req.body;
		// TODO validation
		try {
			// check if username is taken
			const existingUser = await User.findOne({ username });
			if (existingUser != null) {
				return resp.status(400).json({
					error: 'USERNAME_TAKEN'
				});
			}

			// create new user
			const user = new User({
				username,
				password,
				firstName,
				lastName
			});

			// save user to database
			await user.save();

			resp.status(204).json();
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

module.exports = router;
