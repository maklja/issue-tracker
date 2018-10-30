const express = require('express');
const passport = require('passport');

const router = express.Router();
const User = require('../model/User');
const { ensureNotAuthenticated, ensureIsAdmin } = require('./middlewares');

router.delete('/user', ensureIsAdmin, async (req, resp) => {
	const { id } = req.body;

	try {
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
});

router.post('/activate-user', ensureIsAdmin, async (req, resp) => {
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
});

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

router.post('/login', ensureNotAuthenticated, (req, res, next) => {
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
});

router.post('/logout', (req, res) => {
	req.logout(); // delete session
	res.status(204).json(); // sent just confirmed status code without body
});

router.post('/register', ensureNotAuthenticated, async (req, resp) => {
	const {
		username,
		password,
		repeatPassword,
		firstName,
		lastName
	} = req.body;
	// TODO validation
	try {
		// check if username is taken
		const existingUser = await User.findOne({ username });
		if (existingUser != null) {
			resp.status(400).json({
				error: 'USERNAME_TAKEN'
			});
			return;
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
});

module.exports = router;
