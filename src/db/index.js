const mongoose = require('mongoose');

module.exports = {
	createConnection(url) {
		return new Promise((resolve, reject) => {
			// connect to database
			mongoose.connect(
				url,
				{
					useNewUrlParser: true,
					useCreateIndex: true
				}
			);

			mongoose.connection
				.once('open', () => resolve(mongoose.connection))
				.on('error', err => {
					// eslint-disable-next-line
					console.error(err);

					reject(err);
				});
		});
	}
};
