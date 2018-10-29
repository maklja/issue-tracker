const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(403).send({
			error: 'ACCESS_DENIED'
		});
	}
};

const ensureNotAuthenticated = (req, res, next) => {
	if (req.isAuthenticated() === false) {
		next();
	} else {
		res.status(403).send({
			error: 'ACCESS_DENIED'
		});
	}
};

module.exports = {
	ensureAuthenticated,
	ensureNotAuthenticated
};
