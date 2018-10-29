const express = require('express');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const routes = require('./routes');

const app = express();
const port = 3000;

app.use(logger('short')); // request logger
app.use(express.static(path.join(__dirname, 'public'))); // static content location
app.use(bodyParser.urlencoded({ extended: false })); // request body parser
app.use(cookieParser()); // cookie parser
app.use(
	// session management
	session({
		secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
		resave: true,
		saveUninitialized: true
	})
);

app.use(routes);

app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Issue tracker app listening on port ${port}!`);
});
