import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
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
import StatusPreview from './view/status/StatusPreview';
import StatusForm from './view/status/StatusForm';

import LogoutView from './view/login/LogoutView';

const NavBar = ({ isLoggedIn, isAdmin, user }) => {
	return (
		<div>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>

				{isAdmin ? (
					<li>
						<Link to="/users">Users</Link>
					</li>
				) : (
					''
				)}

				{isAdmin ? (
					<li>
						<Link to="/status">Status</Link>
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

				{isLoggedIn ? (
					<li>
						<Link to="/">{user.username}</Link>
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
		const { isLoading, isLoggedIn, isAdmin, user } = this.props;
		return (
			<div>
				{isLoading ? (
					<div>Loading, please wait...</div>
				) : (
					<BrowserRouter>
						<div>
							<NavBar
								isLoggedIn={isLoggedIn}
								isAdmin={isAdmin}
								user={user}
							/>
							<Route
								exact
								path="/register"
								render={() =>
									isLoggedIn === false ? (
										<RegisterView />
									) : (
										<Redirect to="/" />
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
										<Redirect to="/" />
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
									return isAdmin ? (
										<UsersPreview />
									) : (
										<Redirect to="/login" />
									);
								}}
							/>

							<Route
								exact
								path="/status"
								onEnter={this.requireAuth}
								render={() => {
									return isLoggedIn ? (
										<StatusPreview />
									) : (
										<Redirect to="/login" />
									);
								}}
							/>

							<Route
								exact
								path="/manage-status/:id?"
								render={({ match }) => {
									const id = match.params.id;
									return isLoggedIn ? (
										<StatusForm statusId={id} />
									) : (
										<Redirect to="/login" />
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
	const { isLoading, isAdmin, isLoggedIn, user } = init;
	return { isLoading, isAdmin, isLoggedIn, user };
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
