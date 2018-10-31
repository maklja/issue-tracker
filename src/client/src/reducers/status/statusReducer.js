import {
	FETCH_ALL_STATUS_START,
	FETCH_ALL_STATUS_FAILED,
	FETCH_ALL_STATUS_DONE,
	SAVE_STATUS_START,
	SAVE_STATUS_FAILED,
	SAVE_STATUS_DONE,
	DELETE_STATUS_START,
	DELETE_STATUS_DONE,
	DELETE_STATUS_FAILED
} from '../../actions/statusAction';

import { ResultTypes } from '../../utils';

const initState = {
	status: [],
	isLoading: false,
	result: {},
	isSaveInProgress: false
};

export default (state = initState, action) => {
	switch (action.type) {
		case FETCH_ALL_STATUS_START:
			return {
				...state,
				isLoading: true,
				result: {}
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
				result: {
					error: action.error
				}
			};
		case SAVE_STATUS_START:
			return {
				...state,
				isSaveInProgress: true,
				result: {}
			};
		case SAVE_STATUS_DONE:
			const newStatus = action.status;
			const index = state.status.findIndex(
				curStatus => curStatus._id === newStatus._id
			);

			if (index > -1) {
				state.status[index] = newStatus;
				return {
					...state,
					status: [...state.status],
					isSaveInProgress: false,
					result: {
						type: ResultTypes.OK,
						message: 'New status is created',
						error: null
					}
				};
			} else {
				return {
					...state,
					status: [...state.status, newStatus],
					isSaveInProgress: false,
					result: {
						type: ResultTypes.OK,
						message: 'New status is created',
						error: null
					}
				};
			}
		case SAVE_STATUS_FAILED:
			return {
				...state,
				isSaveInProgress: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to save status',
					error: action.error
				}
			};

		case DELETE_STATUS_START:
			return {
				...state,
				result: {}
			};
		case DELETE_STATUS_DONE:
			return {
				...state,
				status: state.status.filter(
					curStatus => curStatus._id !== action.id
				),
				result: {
					type: ResultTypes.OK,
					message: 'Issue is deleted.',
					error: null
				}
			};
		case DELETE_STATUS_FAILED:
			return {
				...state,
				result: {
					type: ResultTypes.ERROR,
					message: 'Cannot delete issue',
					error: action.error
				}
			};
		default:
			return state;
	}
};
