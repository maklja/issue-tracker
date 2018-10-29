const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');

passport.use(
	'local',
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username });

			if (!user) {
				// user with specified username not found
				return done(null, false, {
					message: 'Invalid username or password.'
				});
			}

			// are password match
			const isMatch = await user.checkPassword(password);

			return isMatch
				? done(null, user)
				: done(null, false, {
						message: 'Invalid username or password.'
				  });
		} catch (err) {
			return done(err);
		}
	})
);

module.exports = () => {
	passport.serializeUser((user, done) => done(null, user._id)); // serialize user to the session

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user)); // deserialize user from session
	});
};
