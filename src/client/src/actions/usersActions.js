export const FETCH_USERS_START = 'FETCH_USERS_START';
export const FETCH_USERS_DONE = 'FETCH_USERS_DONE';
export const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED';
export const ACTIVATE_USER_START = 'ACTIVATE_USER_START';
export const ACTIVATE_USER_DONE = 'ACTIVATE_USER_DONE';
export const ACTIVATE_USER_FAILED = 'ACTIVATE_USER_FAILED';
export const DELETE_USER_START = 'DELETE_USER_START';
export const DELETE_USER_DONE = 'DELETE_USER_DONE';
export const DELETE_USER_FAILED = 'DELETE_USER_FAILED';

const deleteUserStart = () => {
	return { type: DELETE_USER_START };
};

const deleteUserDone = userId => {
	return { type: DELETE_USER_DONE, userId };
};

const deleteUserFailed = error => {
	return { type: DELETE_USER_FAILED, error };
};

const activateUserStart = () => {
	return { type: ACTIVATE_USER_START };
};

const activateUserDone = userId => {
	return { type: ACTIVATE_USER_DONE, userId };
};

const activateUserFailed = error => {
	return { type: ACTIVATE_USER_FAILED, error };
};

const fetchUsersStart = () => {
	return { type: FETCH_USERS_START };
};

const fetchUsersDone = users => {
	return { type: FETCH_USERS_DONE, users };
};

const fetchUsersFailed = error => {
	return { type: FETCH_USERS_FAILED, error };
};

// async action for fetching all users
export const fetchUsers = () => {
	return async dispatch => {
		try {
			dispatch(fetchUsersStart());

			const response = await fetch('/api/users', {
				method: 'GET'
			});

			if (response.ok === false) {
				dispatch(fetchUsersFailed(new Error('Failed to fetch user')));
				return;
			}

			const allUsers = await response.json();

			dispatch(fetchUsersDone(allUsers));
		} catch (err) {
			dispatch(fetchUsersFailed(err));
		}
	};
};

// async action for user activation
export const activateUser = userId => {
	return async dispatch => {
		try {
			dispatch(activateUserStart());

			const response = await fetch('/api/activate-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id: userId
				})
			});

			if (response.ok === false) {
				dispatch(
					activateUserFailed(new Error('Failed to activate account'))
				);
			} else {
				dispatch(activateUserDone(userId));
			}
		} catch (err) {
			dispatch(activateUserFailed(err));
		}
	};
};

// async action for user delete
export const deleteUser = id => {
	return async dispatch => {
		try {
			dispatch(deleteUserStart());

			const response = await fetch('/api/user', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					id: id
				})
			});

			if (response.ok === false) {
				const error = await response.json();
				dispatch(deleteUserFailed(error));
			} else {
				dispatch(deleteUserDone(id));
			}
		} catch (err) {
			dispatch(deleteUserFailed(err));
		}
	};
};
