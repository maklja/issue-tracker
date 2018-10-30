import React, { Component } from 'react';

class IssueForm extends Component {
	constructor(props) {
		super(props);

		const { issue } = props;
		const { _id, title, content, status } = issue || {
			_id: null,
			title: '',
			content: '',
			status: null
		};

		this.state = {
			_id,
			title,
			content,
			status,
			message: '',
			availableStatus: []
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	render() {
		const {
			_id,
			title,
			content,
			status,
			message,
			availableStatus
		} = this.state;
		// TODO client side validation
		return (
			<div>
				<form>
					<div>
						<label>Title</label>
						<input
							name="title"
							type="text"
							value={title}
							placeholder="Enter title"
							onChange={this._onChange}
						/>
					</div>
					<div>
						{_id != null ? (
							<select
								name="status"
								defaultValue={status}
								onChange={this._onChange}
							>
								{availableStatus.map(curStatus => {
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
					<div>
						<label>Content</label>
						<textarea
							name="content"
							placeholder="Write issue"
							onChange={this._onChange}
							value={content}
						/>
					</div>
					<div>{message}</div>
					<div>
						<button type="button" onClick={this._onSubmit}>
							Submit
						</button>
					</div>
				</form>
			</div>
		);
	}

	async componentDidMount() {
		try {
			const { issueId } = this.props;
			let issue = {};
			// send registration request
			const statusResponse = await fetch('/api/status', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});

			if (issueId) {
				// send registration request
				const issueResponse = await fetch(`/api/issue/${issueId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					}
				});
				issue = await issueResponse.json();
			}

			const statusResponseBody = await statusResponse.json();

			this.setState({
				availableStatus: statusResponseBody,
				status:
					statusResponseBody.length > 0
						? statusResponseBody[0]._id
						: null,
				...issue
			});
		} catch (error) {
			this.setState({
				message: 'Unable to submit new issue, please try again later.'
			});
		}
	}

	_onChange(e) {
		const el = e.target;
		const name = el.name;

		this.setState({
			[name]: el.value
		});
	}

	async _onSubmit() {
		const { _id, title, content, status } = this.state;

		try {
			// send registration request
			const response = await fetch('/api/save-issue', {
				method: 'POST',
				body: JSON.stringify({
					// form data
					_id,
					title,
					content,
					status
				})
			});
			const responseBody = await response.json();

			if (response.ok === false) {
				this.setState({
					message:
						responseBody.error === 'STATUS_NOT_FOUND'
							? 'Invalid statis id.'
							: 'Unable to submit issue to server.'
				});
			} else {
				this.setState({
					message: 'Issue submitted successfully.'
				});
			}
		} catch (error) {
			this.setState({
				message: 'Unable to submit new issue, please try again later.'
			});
		}
	}
}

export default IssueForm;
