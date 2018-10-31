import {
	FETCH_ISSUES_START,
	FETCH_ISSUES_DONE,
	FETCH_ISSUES_FAILED,
	ARCHIVE_ISSUE_START,
	ARCHIVE_ISSUE_DONE,
	ARCHIVE_ISSUE_FAILED,
	DELETE_ISSUE_START,
	DELETE_ISSUE_DONE,
	DELETE_ISSUE_FAILED,
	SAVE_ISSUE_START,
	SAVE_ISSUE_DONE,
	SAVE_ISSUE_FAILED,
	ASSIGN_ISSUE_START,
	ASSIGN_ISSUE_DONE,
	ASSIGN_ISSUE_FAILED
} from '../../actions/issueActions';
import { ResultTypes } from '../../utils';

const initState = {
	issues: [],
	isLoading: false,
	isDeleteInProgress: false,
	isSaveInProgress: false,
	result: {}
};

// ticket redux reducer
export default (state = initState, action) => {
	switch (action.type) {
		case FETCH_ISSUES_START:
			return {
				...state,
				isLoading: true,
				result: {}
			};
		case FETCH_ISSUES_DONE:
			return {
				...state,
				issues: [...action.issues],
				isLoading: false
			};
		case FETCH_ISSUES_FAILED:
			return {
				...state,
				isLoading: false,
				issues: [],
				result: {
					type: ResultTypes.OK,
					message: 'Unable to fetch issues.',
					error: action.error
				}
			};
		case ARCHIVE_ISSUE_START:
		case DELETE_ISSUE_START:
			return {
				...state,
				isDeleteInProgress: true,
				result: {}
			};
		case ARCHIVE_ISSUE_DONE:
		case DELETE_ISSUE_DONE:
			return {
				...state,
				isDeleteInProgress: false,
				issues: state.issues.filter(
					curIssue => curIssue._id !== action.issueId
				),
				result: {
					type: ResultTypes.OK,
					message: 'Issue is deleted.',
					error: null
				}
			};
		case ARCHIVE_ISSUE_FAILED:
		case DELETE_ISSUE_FAILED:
			return {
				...state,
				isDeleteInProgress: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to delete issue.',
					error: action.error
				}
			};
		case SAVE_ISSUE_DONE:
			const issue = action.issue;
			const index = state.issues.findIndex(
				curIssue => curIssue._id === issue._id
			);

			if (index > -1) {
				state.issues[index] = issue;
				return {
					...state,
					isSaveInProgress: false,
					issues: [...state.issues],
					result: {
						type: ResultTypes.OK,
						message: 'Issue is updated.',
						error: null
					}
				};
			} else {
				return {
					...state,
					isSaveInProgress: false,
					issues: [...state.issues, issue],
					result: {
						type: ResultTypes.OK,
						message: 'New issue is created.',
						error: null
					}
				};
			}
		case SAVE_ISSUE_START:
			return {
				...state,
				isSaveInProgress: true,
				result: {}
			};
		case SAVE_ISSUE_FAILED:
			return {
				...state,
				isSaveInProgress: false,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to save issue.',
					error: action.error
				}
			};
		case ASSIGN_ISSUE_START:
			return {
				...state,
				result: {}
			};
		case ASSIGN_ISSUE_DONE:
			const idx = state.issues.findIndex(
				curIssue => curIssue._id === action.issue._id
			);

			if (idx > -1) {
				state.issues[idx] = action.issue;
				return {
					...state,
					isSaveInProgress: false,
					issues: [...state.issues],
					result: {}
				};
			}
			return state;
		case ASSIGN_ISSUE_FAILED:
			return {
				...state,
				result: {
					type: ResultTypes.ERROR,
					message: 'Unable to assign issue.',
					error: action.error
				}
			};
		default:
			return state;
	}
};
