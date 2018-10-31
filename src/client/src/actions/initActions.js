export const FETCH_INIT_START = 'FETCH_INIT_START';
export const FETCH_INIT_DONE = 'FETCH_INIT_DONE';
export const FETCH_INIT_FAILED = 'FETCH_INIT_FAILED';
export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_DONE = 'LOGOUT_DONE';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_DONE = 'LOGIN_DONE';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const REGISTRATION_START = 'REGISTRATION_START';
export const REGISTRATION_DONE = 'REGISTRATION_DONE';
export const REGISTRATION_FAILED = 'REGISTRATION_FAILED';

const registrationStart = () => {
	return { type: REGISTRATION_START };
};

const registrationDone = () => {
	return { type: REGISTRATION_DONE };
};

const registrationFailed = error => {
	return { type: REGISTRATION_FAILED, error };
};

const loginStart = () => {
	return { type: LOGIN_START };
};

const loginDone = user => {
	return { type: LOGIN_DONE, user };
};

const loginFailed = error => {
	return { type: LOGIN_FAILED, error };
};

const logoutStart = () => {
	return { type: LOGOUT_START };
};

const logoutDone = () => {
	return { type: LOGOUT_DONE };
};

const logoutFailed = error => {
	return { type: LOGOUT_FAILED, error };
};

const fetchInitStart = () => {
	return { type: FETCH_INIT_START };
};

const fetchInitDone = initData => {
	return { type: FETCH_INIT_DONE, initData };
};

const fetchInitFailed = error => {
	return { type: FETCH_INIT_FAILED, error };
};

// async action for fetching init parameters of application
export const fetchInit = () => {
	return async dispatch => {
		try {
			dispatch(fetchInitStart());

			const response = await fetch('/api/init', {
				method: 'GET'
			});

			const initData = await response.json();

			if (response.ok) {
				dispatch(fetchInitDone(initData));
			} else {
				dispatch(fetchInitFailed(initData));
			}
		} catch (err) {
			dispatch(fetchInitFailed(err));
		}
	};
};

// async action for logout
export const logout = () => {
	return async dispatch => {
		try {
			dispatch(logoutStart());

			await fetch('/api/logout', {
				method: 'POST'
			});
			dispatch(logoutDone());
		} catch (err) {
			dispatch(logoutFailed(err));
		}
	};
};

// async action for login
export const login = (username, password) => {
	return async dispatch => {
		try {
			dispatch(loginStart());

			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					// form data
					username,
					password
				})
			});

			// extract server response
			const responseBody = await response.json();
			const { user } = responseBody;

			dispatch(loginDone(user));
		} catch (err) {
			dispatch(loginFailed(err));
		}
	};
};

// async action for user registration
export const register = user => {
	return async dispatch => {
		try {
			dispatch(registrationStart());

			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					...user
				})
			});

			if (response.ok === false) {
				// extract server response
				const responseBody = await response.json();

				dispatch(registrationFailed(responseBody));
			} else {
				dispatch(registrationDone());
			}
		} catch (err) {
			dispatch(registrationFailed(err));
		}
	};
};
