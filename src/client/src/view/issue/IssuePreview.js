import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
	fetchIssues,
	archiveIssue,
	deleteIssue
} from '../../actions/issueActions';
import { Message } from '../message';

class IssuePreview extends Component {
	render() {
		const {
			issues,
			isAdmin,
			userId,
			archiveIssue,
			deleteIssue,
			result
		} = this.props;

		// TODO client side validation
		return (
			<div>
				<Message {...result} />
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Status</th>
							<th>Reporter</th>
							<th>Assign to</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{issues.map(curIssue => {
							const {
								_id,
								title,
								status,
								reportedBy,
								assignTo
							} = curIssue;
							return (
								<tr key={_id}>
									<td>
										<Link to={`/manage-issue/${_id}`}>
											{title}
										</Link>
									</td>
									<td>{status.name}</td>
									<td>
										{`${reportedBy.firstName} ${
											reportedBy.lastName
										}`}
									</td>
									<td>
										{assignTo
											? `${assignTo.firstName} ${
													assignTo.lastName
											  }`
											: 'None'}
									</td>
									<td>
										<button
											onClick={e => {
												e.stopPropagation();
												archiveIssue(_id);
											}}
											disabled={
												userId !== reportedBy._id &&
												isAdmin === false
											}
										>
											Archive
										</button>

										{isAdmin ? (
											<button
												onClick={e => {
													e.stopPropagation();
													deleteIssue(_id);
												}}
												disabled={
													userId !== reportedBy._id &&
													isAdmin === false
												}
											>
												Delete
											</button>
										) : (
											''
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	componentDidMount() {
		this.props.fetchIssues();
	}
}

const mapStateToProps = state => {
	const { init, issueData } = state;
	const { isAdmin, user } = init;
	const { issues, isLoading, result } = issueData;

	return {
		issues,
		isAdmin,
		isLoading,
		userId: user ? user._id : null,
		result
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchIssues: () => {
			dispatch(fetchIssues());
		},
		archiveIssue: issueId => {
			dispatch(archiveIssue(issueId));
		},
		deleteIssue: issueId => {
			dispatch(deleteIssue(issueId));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IssuePreview);
