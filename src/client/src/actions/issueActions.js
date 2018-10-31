export const FETCH_ISSUES_START = 'FETCH_ISSUES_START';
export const FETCH_ISSUES_DONE = 'FETCH_ISSUES_DONE';
export const FETCH_ISSUES_FAILED = 'FETCH_ISSUES_FAILED';
export const ARCHIVE_ISSUE_START = 'ARCHIVE_ISSUE_START';
export const ARCHIVE_ISSUE_DONE = 'ARCHIVE_ISSUE_DONE';
export const ARCHIVE_ISSUE_FAILED = 'ARCHIVE_ISSUE_FAILED';
export const DELETE_ISSUE_START = 'DELETE_ISSUE_START';
export const DELETE_ISSUE_DONE = 'DELETE_ISSUE_DONE';
export const DELETE_ISSUE_FAILED = 'DELETE_ISSUE_FAILED';
export const SAVE_ISSUE_START = 'SAVE_ISSUE_START';
export const SAVE_ISSUE_DONE = 'SAVE_ISSUE_DONE';
export const SAVE_ISSUE_FAILED = 'SAVE_ISSUE_FAILED';
export const ASSIGN_ISSUE_START = 'ASSIGN_ISSUE_START';
export const ASSIGN_ISSUE_DONE = 'ASSIGN_ISSUE_DONE';
export const ASSIGN_ISSUE_FAILED = 'ASSIGN_ISSUE_FAILED';

const assignIssueStart = () => {
	return { type: ASSIGN_ISSUE_START };
};

const assignIssueDone = issue => {
	return { type: ASSIGN_ISSUE_DONE, issue };
};

const assignIssueFailed = error => {
	return { type: ASSIGN_ISSUE_FAILED, error };
};

const saveIssueStart = () => {
	return { type: SAVE_ISSUE_START };
};

const saveIssueDone = issue => {
	return { type: SAVE_ISSUE_DONE, issue };
};

const saveIssueFailed = error => {
	return { type: SAVE_ISSUE_FAILED, error };
};

const fetchIssuesStart = () => {
	return { type: FETCH_ISSUES_START };
};

const fetchIssuesDone = issues => {
	return { type: FETCH_ISSUES_DONE, issues };
};

const fetchIssuesFailed = error => {
	return { type: FETCH_ISSUES_FAILED, error };
};

const archiveIssuesStart = () => {
	return { type: ARCHIVE_ISSUE_START };
};

const archiveIssuesDone = id => {
	return { type: ARCHIVE_ISSUE_DONE, issueId: id };
};

const archiveIssuesFailed = error => {
	return { type: ARCHIVE_ISSUE_FAILED, error };
};

const deleteIssuesStart = () => {
	return { type: DELETE_ISSUE_START };
};

const deleteIssuesDone = id => {
	return { type: DELETE_ISSUE_DONE, issueId: id };
};

const deleteIssuesFailed = error => {
	return { type: DELETE_ISSUE_FAILED, error };
};

// async action for fetching all tickets from server
export const fetchIssues = () => {
	return async dispatch => {
		try {
			dispatch(fetchIssuesStart());

			const response = await fetch('/api/issues', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});
			const issues = await response.json();

			dispatch(fetchIssuesDone(issues));
		} catch (err) {
			dispatch(fetchIssuesFailed(err));
		}
	};
};

// async action for ticket soft delete
export const archiveIssue = id => {
	return async dispatch => {
		try {
			dispatch(archiveIssuesStart());

			const response = await fetch('/api/issue/archive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id
				})
			});

			if (response.ok === false) {
				dispatch(
					archiveIssuesFailed(new Error('Archive issue failed.'))
				);
			} else {
				dispatch(archiveIssuesDone(id));
			}
		} catch (err) {
			dispatch(archiveIssuesFailed(err));
		}
	};
};

// async action for ticket hard delete
export const deleteIssue = id => {
	return async dispatch => {
		try {
			dispatch(deleteIssuesStart());

			const response = await fetch('/api/issue', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id
				})
			});

			if (response.ok === false) {
				dispatch(deleteIssuesFailed(new Error('Delete issue failed.')));
			} else {
				dispatch(deleteIssuesDone(id));
			}
		} catch (err) {
			dispatch(deleteIssuesFailed(err));
		}
	};
};

// async action for ticket save
export const saveIssue = issue => {
	return async dispatch => {
		try {
			dispatch(saveIssueStart());

			const response = await fetch('/api/save-issue', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					...issue
				})
			});
			const responseBody = await response.json();
			if (response.ok) {
				dispatch(saveIssueDone(responseBody));
			} else {
				dispatch(saveIssueFailed(responseBody));
			}
		} catch (err) {
			dispatch(saveIssueFailed(err));
		}
	};
};

// async action for ticket async
export const assignIssue = id => {
	return async dispatch => {
		try {
			dispatch(assignIssueStart());

			const response = await fetch('/api/issue/assign', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id
				})
			});

			const responseBody = await response.json();
			if (response.ok) {
				dispatch(assignIssueDone(responseBody));
			} else {
				dispatch(assignIssueFailed(responseBody));
			}
		} catch (err) {
			dispatch(assignIssueFailed(err));
		}
	};
};
