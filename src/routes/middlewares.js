const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(403).json({
			error: 'ACCESS_DENIED'
		});
	}
};

const ensureIsAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user.admin === true) {
		next();
	} else {
		res.status(403).json({
			error: 'ACCESS_DENIED'
		});
	}
};

const ensureNotAuthenticated = (req, res, next) => {
	if (req.isAuthenticated() === false) {
		next();
	} else {
		res.status(403).json({
			error: 'ACCESS_DENIED'
		});
	}
};

module.exports = {
	ensureIsAdmin,
	ensureAuthenticated,
	ensureNotAuthenticated
};
