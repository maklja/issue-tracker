import {
	FETCH_INIT_START,
	FETCH_INIT_DONE,
	FETCH_INIT_FAILED,
	LOGOUT_START,
	LOGOUT_DONE,
	LOGOUT_FAILED,
	LOGIN_START,
	LOGIN_DONE,
	LOGIN_FAILED,
	REGISTRATION_START,
	REGISTRATION_DONE,
	REGISTRATION_FAILED
} from '../../actions/initActions';

import { ResultTypes } from '../../utils';

const initState = {
	isLoading: false,
	isLoggedIn: false,
	isAdmin: false,
	user: null,
	isLoginStarted: false,
	isRegistrationInProgress: false,
	result: {}
};

// init redux reducer
export default (state = initState, action) => {
	switch (action.type) {
		case FETCH_INIT_START:
			return {
				...state,
				isLoading: true,
				result: {}
			};
		case FETCH_INIT_DONE:
			const initData = action.initData;
			return {
				...state,
				isLoading: false,
				user: initData.user,
				isLoggedIn: initData.user != null,
				isAdmin: initData.user != null && initData.user.admin === true
			};
		case FETCH_INIT_FAILED:
			return {
				...state,
				isLoading: false,
				user: null,
				isLoggedIn: false,
				isAdmin: false,
				result: { error: action.error }
			};
		case LOGOUT_DONE:
		case LOGOUT_FAILED:
			return {
				...state,
				user: null,
				isLoggedIn: false,
				isAdmin: false
			};
		case LOGIN_START:
			return {
				...state,
				isLoginStarted: true,
				result: {}
			};
		case LOGIN_DONE:
			return {
				...state,
				isLoginStarted: false,
				user: action.user,
				isLoggedIn: action.user != null,
				isAdmin: action.user != null && action.user.admin === true,
				result:
					action.user == null
						? {
								type: ResultTypes.ERROR,
								message: 'Invalid username or password.'
						  }
						: {}
			};
		case LOGIN_FAILED:
			return {
				...state,
				isLoginStarted: false,
				user: null,
				isLoggedIn: false,
				isAdmin: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'User login failed, please try again later',
					error: action.error
				}
			};
		case REGISTRATION_START:
			return {
				...state,
				isRegistrationInProgress: true,
				result: {}
			};
		case REGISTRATION_DONE:
			return {
				...state,
				isRegistrationInProgress: false,
				result: {
					type: ResultTypes.OK,
					message: 'User registration is complited',
					error: null
				}
			};
		case REGISTRATION_FAILED:
			return {
				...state,
				isRegistrationInProgress: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'User registration failed.',
					error: action.error
				}
			};
		case LOGOUT_START:
		default:
			return state;
	}
};
