import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import 'react-notifications/lib/notifications.css';

import { fetchInit } from './actions/initActions';
import { fetchAllStatus } from './actions/statusAction';
import { fetchIssues } from './actions/issueActions';
import IssuePreview from './view/issue/IssuePreview';
import IssueForm from './view/issue/IssueForm';
import UsersPreview from './view/users/UsersPreview';
import RegisterView from './view/register/RegisterView';
import LoginView from './view/login/LoginView';

import './App.css';
import LogoutView from './view/login/LogoutView';

const NavBar = ({ isLoggedIn, isAdmin }) => {
	return (
		<div>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>

				{isLoggedIn ? (
					<li>
						<Link to="/manage-issue">New issue</Link>
					</li>
				) : (
					''
				)}

				{isAdmin ? (
					<li>
						<Link to="/users">Users</Link>
					</li>
				) : (
					''
				)}

				{isLoggedIn === false ? (
					<li>
						<Link to="/register">Register</Link>
					</li>
				) : (
					''
				)}

				{isLoggedIn === false ? (
					<li>
						<Link to="/login">Login</Link>
					</li>
				) : (
					''
				)}

				{isLoggedIn ? (
					<li>
						<Link to="/logout">Logout</Link>
					</li>
				) : (
					''
				)}
			</ul>
		</div>
	);
};

class App extends Component {
	render() {
		const { isLoading, isLoggedIn, isAdmin } = this.props;
		return (
			<div>
				{isLoading ? (
					<div>Loading, please wait...</div>
				) : (
					<BrowserRouter>
						<div>
							<NavBar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
							<Route
								exact
								path="/register"
								render={() =>
									isLoggedIn === false ? (
										<RegisterView />
									) : (
										<IssuePreview />
									)
								}
							/>
							<Route
								exact
								path="/login"
								render={() =>
									isLoggedIn === false ? (
										<LoginView onLogin={this._onLogin} />
									) : (
										<IssuePreview />
									)
								}
							/>

							<Route
								exact
								path="/manage-issue/:id?"
								render={({ match }) => {
									const id = match.params.id;
									return <IssueForm issueId={id} />;
								}}
							/>

							<Route
								exact
								path="/users"
								render={() => {
									return isLoggedIn ? (
										<UsersPreview />
									) : (
										<IssuePreview />
									);
								}}
							/>

							<Route
								exact
								path="/logout"
								render={() => (
									<LogoutView onLogout={this._onLogout} />
								)}
							/>

							<Route
								path="/"
								render={() => {
									return <IssuePreview />;
								}}
								exact
							/>
						</div>
					</BrowserRouter>
				)}
			</div>
		);
	}

	componentDidMount() {
		this.props.init();
	}
}

const mapStateToProps = state => {
	const { init } = state;
	const { isLoading, isAdmin, isLoggedIn } = init;
	return { isLoading, isAdmin, isLoggedIn };
};

const mapDispatchToProps = dispatch => {
	return {
		init: () => {
			dispatch(fetchInit());
			dispatch(fetchAllStatus());
			dispatch(fetchIssues());
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
