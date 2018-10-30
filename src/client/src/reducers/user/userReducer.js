import {
	FETCH_USERS_START,
	FETCH_USERS_DONE,
	FETCH_USERS_FAILED,
	ACTIVATE_USER_START,
	ACTIVATE_USER_DONE,
	ACTIVATE_USER_FAILED,
	DELETE_USER_START,
	DELETE_USER_DONE,
	DELETE_USER_FAILED
} from '../../actions/usersActions';
import { ResultTypes } from '../../utils';

const initState = {
	users: [],
	isLoading: false,
	result: {}
};

export default (state = initState, action) => {
	switch (action.type) {
		case FETCH_USERS_START:
			return {
				...state,
				isLoading: true,
				result: {}
			};
		case FETCH_USERS_DONE:
			return {
				...state,
				isLoading: false,
				users: [...action.users]
			};

		case FETCH_USERS_FAILED:
			return {
				...state,
				isLoading: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to fetch users',
					error: action.error
				}
			};
		case ACTIVATE_USER_START:
			return {
				...state,
				result: {}
			};
		case ACTIVATE_USER_DONE:
			const user = state.users.find(
				curUser => curUser._id === action.userId
			);
			if (!user) {
				return state;
			}
			user.activated = true;
			return {
				...state,
				users: [...state.users],
				result: {
					type: ResultTypes.OK,
					message: 'User account is activated.',
					error: null
				}
			};
		case ACTIVATE_USER_FAILED:
			return {
				...state,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to activate user account',
					error: action.error
				}
			};

		case DELETE_USER_START:
			return {
				...state,
				result: {}
			};
		case DELETE_USER_DONE:
			const users = state.users.filter(
				curUser => curUser._id !== action.userId
			);

			return {
				...state,
				users: [...users],
				result: {
					type: ResultTypes.OK,
					message: 'User account is deleted.',
					error: null
				}
			};
		case DELETE_USER_FAILED:
			return {
				...state,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to delete user account',
					error: action.error
				}
			};

		default:
			return state;
	}
};
