import React, { Component } from 'react';

class LoginView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			message: ''
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const { username, password, message } = this.state;

		// TODO client side validation
		return (
			<div>
				<form>
					<div>
						<label>Email</label>
						<input
							name="username"
							type="email"
							value={username}
							placeholder="Enter your email"
							onChange={this._onChange}
							required
						/>
					</div>
					<div>
						<label>Password</label>
						<input
							name="password"
							type="password"
							value={password}
							placeholder="Enter your password"
							onChange={this._onChange}
							required
						/>
					</div>
					<div>{message}</div>
					<div>
						<button type="button" onClick={this._onSubmit}>
							Submit
						</button>
					</div>
				</form>
			</div>
		);
	}

	_onChange(e) {
		const el = e.target;
		const name = el.name;

		this.setState({
			[name]: el.value
		});
	}

	async _onSubmit() {
		const { username, password } = this.state;

		try {
			// send registration request
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

			if (user != null) {
				// set message on UI
				this.setState(
					{
						message: ''
					},
					() => {
						this.props.onLogin(user);
					}
				);
			} else {
				// set message on UI
				this.setState({
					message: 'Invalid username or password.'
				});
			}
		} catch (error) {
			this.setState({
				message: 'Unable to login, please try again later.'
			});
		}
	}
}

export default LoginView;
