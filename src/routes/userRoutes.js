const express = require('express');
const passport = require('passport');

const router = express.Router();
const User = require('../model/User');
const {
	ensureAuthenticated,
	ensureNotAuthenticated
} = require('./middlewares');

router.get('/init', (req, resp) => {
	const { user } = req;
	if (user) {
		// return user information if user is logged in
		resp.send({
			user: {
				username: user.username
			}
		});
	} else {
		resp.send({
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
			return res.send({
				user: null
			});
		}

		// login user
		req.logIn(user, err => {
			if (err) {
				return next(err);
			}

			const { username } = user;

			// send user data to the client
			return res.send({
				user: {
					username
				}
			});
		});
	})(req, res, next);
});

router.post('/logout', (req, res) => {
	req.logout(); // delete session
	res.status(204).send(); // sent just confirmed status code without body
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
			resp.status(400).send({
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

		resp.status(204).send();
	} catch (error) {
		// TODO log error
		resp.status(500).send({
			error: 'INTERNAL_ERROR'
		});
	}
});

module.exports = router;
