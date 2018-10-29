import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import HomePage from './view/pages/HomePage';
import RegisterView from './view/register/RegisterView';
import LoginView from './view/login/LoginView';

import './App.css';
import LogoutView from './view/login/LogoutView';

const isUserLoggedIn = user => user != null;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			user: null
		};

		this._onLogin = this._onLogin.bind(this);
		this._onLogout = this._onLogout.bind(this);
	}

	render() {
		const { isLoading, user } = this.state;

		return (
			<div>
				{isLoading ? (
					<div>Loading, please wait...</div>
				) : (
					<BrowserRouter>
						<div>
							<ul>
								<li>
									<Link to="/">Home</Link>
								</li>

								{user ? (
									<li>
										<Link to="/new-issue">New issue</Link>
									</li>
								) : (
									''
								)}

								{user ? (
									<li>
										<Link to="/my-issues">My issues</Link>
									</li>
								) : (
									''
								)}

								{user == null ? (
									<li>
										<Link to="/register">Register</Link>
									</li>
								) : (
									''
								)}

								{user == null ? (
									<li>
										<Link to="/login">Login</Link>
									</li>
								) : (
									''
								)}

								{user ? (
									<li>
										<Link to="/logout">Logout</Link>
									</li>
								) : (
									''
								)}
							</ul>

							<Route
								exact
								path="/register"
								render={() =>
									isUserLoggedIn(user) === false ? (
										<RegisterView />
									) : (
										<HomePage />
									)
								}
							/>
							<Route
								exact
								path="/login"
								render={() =>
									isUserLoggedIn(user) === false ? (
										<LoginView onLogin={this._onLogin} />
									) : (
										<HomePage />
									)
								}
							/>

							<Route
								exact
								path="/logout"
								render={() => (
									<LogoutView onLogout={this._onLogout} />
								)}
							/>

							<Route path="/" component={HomePage} exact />
						</div>
					</BrowserRouter>
				)}
			</div>
		);
	}

	_onLogin(user) {
		this.setState({
			user
		});
	}

	_onLogout() {
		this.setState({
			user: null
		});
	}

	async componentDidMount() {
		// send registration request
		const response = await fetch('/api/init', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		});

		const initData = await response.json();

		console.log(initData.user);
		this.setState({
			isLoading: false,
			user: initData.user
		});
	}
}

export default App;
