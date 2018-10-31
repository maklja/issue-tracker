import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from '../message';

import { saveStatus } from '../../actions/statusAction';

class StatusForm extends Component {
	constructor(props) {
		super(props);
		const { name, priority, createdBy } = props.status || {};

		this.state = {
			name,
			priority,
			createdBy
		};

		this._onSubmit = this._onSubmit.bind(this);
		this._onChange = this._onChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.status._id !== prevProps.status._id) {
			const { name, priority, createdBy } = this.props.status;
			this.setState({
				name,
				priority,
				createdBy
			});
		}
	}

	render() {
		const { name, priority, createdBy } = this.state;

		const { isDisabled, result, _id } = this.props;

		// TODO client side validation
		return (
			<div>
				<Message {...result} />
				<form>
					<div>
						<label>Name</label>
						<input
							name="name"
							type="text"
							value={name}
							placeholder="Enter name"
							onChange={this._onChange}
							disabled={isDisabled}
						/>
					</div>

					<div>
						<label>Priority</label>
						<input
							name="priority"
							type="number"
							value={priority}
							placeholder="Enter priority"
							onChange={this._onChange}
							disabled={isDisabled}
						/>
					</div>
					{createdBy && _id ? (
						<div>
							<label>Created by</label>
							<input
								name="createdBy"
								type="text"
								value={`${createdBy.firstName} ${
									createdBy.lastName
								}`}
								placeholder="Enter priority"
								onChange={this._onChange}
								disabled={true}
							/>
						</div>
					) : (
						''
					)}
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
		const { name, priority } = this.state;
		const { _id } = this.props.status;

		this.props.saveStatus({
			_id,
			name,
			priority
		});
	}
}

const mapStateToProps = (state, ownProps) => {
	const { statusData } = state;
	const { isSaveInProgress, result, status: statusCollection } = statusData;
	const { statusId } = ownProps;

	return {
		status: statusCollection.find(
			curStatus => curStatus._id === statusId
		) || { _id: null, name: '', priority: 0, createdBy: {} },
		isDisabled: isSaveInProgress,
		result
	};
};

const mapDispatchToProps = dispatch => {
	return {
		saveStatus(status) {
			dispatch(saveStatus(status));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StatusForm);
