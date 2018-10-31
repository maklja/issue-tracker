import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// import polyfills for IE
import 'whatwg-fetch';
import 'core-js/es6/promise';
import 'core-js/es6/object';
import 'core-js/es6/string';
import 'core-js/es6/array';

import rootReducer from './reducers';

import './index.css';
import App from './App';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
