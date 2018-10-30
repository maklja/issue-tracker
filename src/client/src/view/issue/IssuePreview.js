import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class IssuePreview extends Component {
	constructor(props) {
		super(props);

		this.state = {
			issues: []
		};

		this._onSelect = this._onSelect.bind(this);
		this._onSoftDelete = this._onSoftDelete.bind(this);
		this._onHardDelete = this._onHardDelete.bind(this);
	}

	render() {
		const { issues, message } = this.state;
		const { user } = this.props;

		// TODO client side validation
		return (
			<div>
				<div>{message}</div>
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Status</th>
							<th>Reporter</th>
						</tr>
					</thead>
					<tbody>
						{issues.map(curIssue => {
							return (
								<tr
									key={curIssue._id}
									onClick={() => this._onSelect(curIssue._id)}
								>
									<td>{curIssue.title}</td>
									<td>{curIssue.status.name}</td>
									<td>
										{`${curIssue.reportedBy.firstName} ${
											curIssue.reportedBy.lastName
										}`}
									</td>
									<td>
										<button
											onClick={e => {
												e.stopPropagation();
												this._onSoftDelete(
													curIssue._id
												);
											}}
											disabled={
												user == null ||
												user._id !==
													curIssue.reportedBy._id
											}
										>
											Archive
										</button>

										{user && user.admin ? (
											<button
												onClick={e => {
													e.stopPropagation();
													this._onHardDelete(
														curIssue._id
													);
												}}
												disabled={
													user == null ||
													user._id !==
														curIssue.reportedBy._id
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

	async _onHardDelete(id) {
		try {
			// send registration request
			const response = await fetch('/api/issue', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					_id: id
				})
			});

			if (response.on === false) {
				this.setState({
					message: 'Unable to delete issue, please try again later.'
				});
			}

			this._fetchIssues(); // refresh issues
		} catch (error) {
			this.setState({
				message: 'Unable to delete issue, please try again later.'
			});
		}
	}

	async _onSoftDelete(id) {
		try {
			// send registration request
			const response = await fetch('/api/issue/archive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify({
					_id: id
				})
			});

			if (response.on === false) {
				this.setState({
					message: 'Unable to delete issue, please try again later.'
				});
			}

			this._fetchIssues(); // refresh issues
		} catch (error) {
			this.setState({
				message: 'Unable to delete issue, please try again later.'
			});
		}
	}

	_onSelect(id) {
		this.props.history.push(`/manage-issue/${id}`);
	}

	async _fetchIssues() {
		try {
			// send registration request
			const response = await fetch('/api/issues', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});

			const responseBody = await response.json();

			this.setState({
				issues: responseBody
			});
		} catch (error) {
			this.setState({
				message: 'Unable to fetch issues, please try again later.'
			});
		}
	}

	componentDidMount() {
		this._fetchIssues();
	}
}

export default withRouter(IssuePreview);
