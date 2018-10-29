import React, { Component } from 'react';

class RegisterView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			repeatPassword: '',
			firstName: '',
			lastName: '',
			message: ''
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const {
			username,
			password,
			repeatPassword,
			firstName,
			lastName,
			message
		} = this.state;

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
					<div>
						<label>Repeat passsword</label>
						<input
							name="repeatPassword"
							type="password"
							value={repeatPassword}
							placeholder="Repeat your password"
							onChange={this._onChange}
							required
						/>
					</div>
					<div>
						<label>First name</label>
						<input
							name="firstName"
							type="text"
							value={firstName}
							placeholder="Enter first name"
							onChange={this._onChange}
							required
						/>
					</div>
					<div>
						<label>Last name</label>
						<input
							name="lastName"
							type="text"
							value={lastName}
							placeholder="Enter last name"
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
		const {
			username,
			password,
			repeatPassword,
			firstName,
			lastName
		} = this.state;

		try {
			// send registration request
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					// form data
					username,
					password,
					repeatPassword,
					firstName,
					lastName
				})
			});

			if (response.ok === false) {
				// extract server response
				const responseBody = await response.json();

				if (responseBody.error === 'USERNAME_TAKEN') {
					this.setState({
						message: `Username ${username} is taken.`
					});
				} else {
					this.setState({
						message:
							'Unable to register new account, please try again later.'
					});
				}
			} else {
				this.setState({
					message: 'Account is registred.',
					username: '',
					password: '',
					repeatPassword: '',
					firstName: '',
					lastName: ''
				});
			}
		} catch (error) {
			this.setState({
				message:
					'Unable to register new account, please try again later.'
			});
		}
	}
}

export default RegisterView;
