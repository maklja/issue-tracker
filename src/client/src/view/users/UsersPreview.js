import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	fetchUsers,
	activateUser,
	deleteUser
} from '../../actions/usersActions';
import { Message } from '../message';

class UsersPreview extends Component {
	render() {
		const { users, user } = this.props;
		const { result } = this.props;

		const { error: errObj, message } = result;

		const msg =
			errObj && errObj.error === 'HAS_REPORTED_ISSUES'
				? 'User have active tickets'
				: message;

		return (
			<div>
				<Message {...result} message={msg} />
				<table>
					<thead>
						<tr>
							<th>Username</th>
							<th>First name</th>
							<th>Last name</th>
							<th>Is admin</th>
							<th>Is activated</th>
							<th />
						</tr>
						{users.map(curUser => {
							const {
								_id,
								username,
								firstName,
								lastName,
								admin,
								activated
							} = curUser;

							return (
								<tr key={_id}>
									<td>{username}</td>
									<td>{firstName}</td>
									<td>{lastName}</td>
									<td>{admin ? 'Yes' : 'No'}</td>
									<td>{activated ? 'Yes' : 'No'}</td>
									<td>
										<div>
											<button
												onClick={() =>
													this._onActivate(_id)
												}
												disabled={activated}
											>
												Activate
											</button>
											<button
												onClick={() =>
													this._onDelete(_id)
												}
												disabled={_id === user._id}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</thead>
					<tbody />
				</table>
			</div>
		);
	}

	_onActivate(id) {
		this.props.activateUser(id);
	}

	_onDelete(id) {
		this.props.deleteUser(id);
	}

	componentDidMount() {
		this.props.fetchUsers();
	}
}

const mapStateToProps = state => {
	const { userData, init } = state;
	const { users, result } = userData;
	const { user } = init;

	return { users, user, result };
};

const mapDispatchToProps = dispatch => {
	return {
		fetchUsers: () => {
			dispatch(fetchUsers());
		},
		activateUser: id => {
			dispatch(activateUser(id));
		},
		deleteUser: id => {
			dispatch(deleteUser(id));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersPreview);
