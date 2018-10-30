import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from '../message';

import { login } from '../../actions/initActions';

class LoginView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const { username, password } = this.state;
		const { isDisabled, result } = this.props;

		// TODO client side validation
		return (
			<div>
				<Message {...result} />
				<form onSubmit={this._onSubmit}>
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
						<button
							type="button"
							onClick={this._onSubmit}
							disabled={isDisabled}
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
		const { username, password } = this.state;

		this.props.login(username, password);
	}
}

const mapStateToProps = state => {
	const { init } = state;
	const { result, isLoginStarted } = init;

	return { isDisabled: isLoginStarted, result };
};

const mapDispatchToProps = dispatch => {
	return {
		login: (username, password) => {
			dispatch(login(username, password));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginView);
