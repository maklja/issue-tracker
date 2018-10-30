import React, { Component } from 'react';
import { connect } from 'react-redux';

import { register } from '../../actions/initActions';
import { Message } from '../message';

class RegisterView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			repeatPassword: '',
			firstName: '',
			lastName: ''
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
			lastName
		} = this.state;

		const { isDisabled, result } = this.props;
		const { error: errObj, message } = result;
		const msg =
			errObj && errObj.error === 'USERNAME_TAKEN'
				? 'Username already exits'
				: message;
		// TODO client side validation
		return (
			<div>
				<Message {...result} message={msg} />
				<form>
					<div>
						<label>Email</label>
						<input
							name="username"
							type="email"
							value={username}
							placeholder="Enter your email"
							onChange={this._onChange}
							disabled={isDisabled}
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
							disabled={isDisabled}
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
							disabled={isDisabled}
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
							disabled={isDisabled}
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
							disabled={isDisabled}
						/>
					</div>
					<div>
						<button
							type="button"
							disabled={isDisabled}
							onClick={this._onSubmit}
						>
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

	_onSubmit() {
		const {
			username,
			password,
			repeatPassword,
			firstName,
			lastName
		} = this.state;

		this.props.register({
			username,
			password,
			repeatPassword,
			firstName,
			lastName
		});
	}
}

const mapStateToProps = state => {
	const { init } = state;
	const { isRegistrationInProgress, error, result } = init;

	return {
		isDisabled: isRegistrationInProgress,
		error,
		result
	};
};

const mapDispatchToProps = dispatch => {
	return {
		register: user => {
			dispatch(register(user));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterView);
