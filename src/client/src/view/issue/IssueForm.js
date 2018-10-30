import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from '../message';

import { saveIssue, assignIssue } from '../../actions/issueActions';

class IssueForm extends Component {
	constructor(props) {
		super(props);

		const { issue } = props;
		const { _id, title, content, status } = issue;

		this.state = {
			_id,
			title,
			content,
			status
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
		this._assignIssue = this._assignIssue.bind(this);
	}

	render() {
		const { _id, title, content, status } = this.state;
		const {
			statusCollection,
			isDisabled,
			issue,
			result,
			userId
		} = this.props;

		const assignToDisabled =
			userId === (issue && issue.assignTo ? issue.assignTo._id : null);
		// TODO client side validation
		return (
			<div>
				<Message {...result} />
				<form>
					<div>
						<label>Title</label>
						<input
							name="title"
							type="text"
							value={title}
							placeholder="Enter title"
							onChange={this._onChange}
							disabled={isDisabled}
						/>
					</div>
					<div>
						{_id != null ? (
							<select
								name="status"
								defaultValue={status}
								onChange={this._onChange}
								disabled={isDisabled}
							>
								{statusCollection.map(curStatus => {
									const { _id, name } = curStatus;

									return (
										<option key={_id} value={_id}>
											{name}
										</option>
									);
								})}
							</select>
						) : (
							''
						)}
					</div>
					{_id ? (
						<div>
							<label>Create by: </label>
							<input
								type="text"
								value={`${issue.reportedBy.firstName} ${
									issue.reportedBy.lastName
								}`}
								disabled={true}
							/>
						</div>
					) : (
						''
					)}

					{_id ? (
						<div>
							<label>Assign to: </label>
							<input
								type="text"
								value={
									issue.assignTo
										? `${issue.assignTo.firstName} ${
												issue.assignTo.lastName
										  }`
										: 'None'
								}
								disabled={true}
							/>
						</div>
					) : (
						''
					)}

					<div>
						<label>Content</label>
						<textarea
							name="content"
							placeholder="Write issue"
							onChange={this._onChange}
							value={content}
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
						{_id ? (
							<button
								type="button"
								onClick={this._assignIssue}
								disabled={isDisabled || assignToDisabled}
							>
								Assign to me
							</button>
						) : (
							''
						)}
					</div>
				</form>
			</div>
		);
	}

	_assignIssue() {
		const { _id } = this.state;

		this.props.assignIssue(_id);
	}

	_onChange(e) {
		const el = e.target;
		const name = el.name;

		this.setState({
			[name]: el.value
		});
	}

	_onSubmit() {
		const { _id, title, content, status } = this.state;

		this.props.saveOrUpdateIssue({
			_id,
			title,
			content,
			status
		});
	}
}

const mapStateToProps = (state, ownProps) => {
	const { statusData, issueData, init } = state;
	const { status } = statusData;
	const { isLoggedIn, user } = init;
	const { issues, isSaveInProgress, result } = issueData;
	const { issueId } = ownProps;

	return {
		statusCollection: status,
		isDisabled: isSaveInProgress || !isLoggedIn,
		issue: issues.find(curIssue => curIssue._id === issueId) || {
			_id: null,
			title: '',
			content: '',
			status: status[0]
		},
		result,
		userId: user ? user._id : ''
	};
};

const mapDispatchToProps = dispatch => {
	return {
		saveOrUpdateIssue(issue) {
			dispatch(saveIssue(issue));
		},
		assignIssue(id) {
			dispatch(assignIssue(id));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IssueForm);
