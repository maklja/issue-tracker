const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const config = require('./conf');
const { userRoutes } = require('./routes');
const { createConnection } = require('./db');
const setupPassport = require('./utils/setupPassport');

createConnection(config.databaseURL)
	.then(() => {
		// eslint-disable-next-line
		console.log('Connected to database');

		const app = express();
		const port = 4000;

		app.use(logger('short')); // request logger
		app.use(express.static(path.join(__dirname, 'client'))); // static content location
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false })); // request body parser
		app.use(cookieParser()); // cookie parser
		app.use(
			// session management
			session({
				secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
				resave: false,
				saveUninitialized: true
			})
		);
		app.use(passport.initialize());
		app.use(passport.session());

		setupPassport();
		app.use('/api', userRoutes);

		app.listen(port, () => {
			// eslint-disable-next-line
			console.log(`Issue tracker app listening on port ${port}!`);
		});
	})
	.catch(() => {
		// eslint-disable-next-line
		console.error('Unable to connect to database');
	});
