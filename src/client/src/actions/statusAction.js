export const FETCH_ALL_STATUS_START = 'FETCH_ALL_STATUS_START';
export const FETCH_ALL_STATUS_DONE = 'FETCH_ALL_STATUS_DONE';
export const FETCH_ALL_STATUS_FAILED = 'FETCH_ALL_STATUS_FAILED';

const fetchAllStatusStart = () => {
	return { type: FETCH_ALL_STATUS_START };
};

const fetchAllStatusDone = allStatus => {
	return { type: FETCH_ALL_STATUS_DONE, allStatus };
};

const fetchAllStatusFailed = error => {
	return { type: FETCH_ALL_STATUS_FAILED, error };
};

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
