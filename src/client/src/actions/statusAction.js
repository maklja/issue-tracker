export const FETCH_ALL_STATUS_START = 'FETCH_ALL_STATUS_START';
export const FETCH_ALL_STATUS_DONE = 'FETCH_ALL_STATUS_DONE';
export const FETCH_ALL_STATUS_FAILED = 'FETCH_ALL_STATUS_FAILED';
export const SAVE_STATUS_START = 'SAVE_STATUS_START';
export const SAVE_STATUS_DONE = 'SAVE_STATUS_DONE';
export const SAVE_STATUS_FAILED = 'SAVE_STATUS_FAILED';
export const DELETE_STATUS_START = 'DELETE_STATUS_START';
export const DELETE_STATUS_DONE = 'DELETE_STATUS_DONE';
export const DELETE_STATUS_FAILED = 'DELETE_STATUS_FAILED';

const deleteStatusStart = () => {
	return { type: DELETE_STATUS_START };
};

const deleteStatusDone = id => {
	return { type: DELETE_STATUS_DONE, id };
};

const deleteStatusFailed = error => {
	return { type: DELETE_STATUS_FAILED, error };
};

const saveStatusStart = () => {
	return { type: SAVE_STATUS_START };
};

const saveStatusDone = status => {
	return { type: SAVE_STATUS_DONE, status };
};

const saveStatusFailed = error => {
	return { type: SAVE_STATUS_FAILED, error };
};

const fetchAllStatusStart = () => {
	return { type: FETCH_ALL_STATUS_START };
};

const fetchAllStatusDone = allStatus => {
	return { type: FETCH_ALL_STATUS_DONE, allStatus };
};

const fetchAllStatusFailed = error => {
	return { type: FETCH_ALL_STATUS_FAILED, error };
};

// async action for getting ticket status
export const fetchAllStatus = () => {
	return async dispatch => {
		try {
			dispatch(fetchAllStatusStart());

			const response = await fetch('/api/status', {
				method: 'GET'
			});

			const allStatus = await response.json();

			dispatch(fetchAllStatusDone(allStatus));
		} catch (err) {
			dispatch(fetchAllStatusFailed(err));
		}
	};
};

// async action for saving and updating new status for ticket
export const saveStatus = status => {
	return async dispatch => {
		try {
			dispatch(saveStatusStart());

			const response = await fetch('/api/save-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					...status
				})
			});

			const saveStatus = await response.json();
			if (response.ok) {
				dispatch(saveStatusDone(saveStatus));
			} else {
				dispatch(saveStatusFailed(saveStatus));
			}
		} catch (err) {
			dispatch(saveStatusFailed(err));
		}
	};
};

// async action for status delete
export const deleteStatus = id => {
	return async dispatch => {
		try {
			dispatch(deleteStatusStart());

			const response = await fetch('/api/delete-status', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id
				})
			});

			if (response.ok) {
				dispatch(deleteStatusDone(id));
			} else {
				const responseBody = await response.json();
				dispatch(deleteStatusFailed(responseBody));
			}
		} catch (err) {
			dispatch(deleteStatusFailed(err));
		}
	};
};
