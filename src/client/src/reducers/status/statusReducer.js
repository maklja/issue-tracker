import {
	FETCH_ALL_STATUS_START,
	FETCH_ALL_STATUS_FAILED,
	FETCH_ALL_STATUS_DONE
} from '../../actions/statusAction';

const initState = {
	status: [],
	isLoading: false
};

export default (state = initState, action) => {
	switch (action.type) {
		case FETCH_ALL_STATUS_START:
			return {
				...state,
				isLoading: true,
				error: null
			};
		case FETCH_ALL_STATUS_DONE:
			return {
				...state,
				isLoading: false,
				status: [...action.allStatus]
			};

		case FETCH_ALL_STATUS_FAILED:
			return {
				...state,
				isLoading: false,
				status: [],
				error: action.error
			};
		default:
			return state;
	}
};
