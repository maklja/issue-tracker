import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { deleteStatus } from '../../actions/statusAction';
import { Message } from '../message';

class StatusPreview extends Component {
	constructor(props) {
		super(props);

		this.onDelete = this.onDelete.bind(this);
	}

	render() {
		const { status, result } = this.props;
		const { error: errObj, message } = result;
		const msg =
			errObj && errObj.error === 'IS_ATTACHED_TO_ISSUES'
				? 'Status is currently in use in tickets'
				: message;

		return (
			<div>
				<Message {...result} message={msg} />
				<div>
					<label>
						<Link to="/manage-status">Create new status</Link>
					</label>
				</div>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Created by</th>
							<th>Priority</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{status.map(curStatus => {
							const {
								_id,
								name,
								priority,
								createdBy
							} = curStatus;
							return (
								<tr key={_id}>
									<td>
										<Link to={`/manage-status/${_id}`}>
											{name}
										</Link>
									</td>
									<td>
										{`${createdBy.firstName} ${
											createdBy.lastName
										}`}
									</td>
									<td>{priority}</td>
									<td>
										<button
											onClick={() => this.onDelete(_id)}
										>
											Delete
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	onDelete(id) {
		this.props.deleteStatus(id);
	}
}

const mapStateToProps = state => {
	const { statusData } = state;
	const { status, result } = statusData;

	return { status, result };
};

const mapDispatchToProps = dispatch => {
	return {
		deleteStatus: id => {
			dispatch(deleteStatus(id));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StatusPreview);
