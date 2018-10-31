import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logout } from '../../actions/initActions';

class LogoutView extends Component {
	render() {
		return <Redirect to="/login" />;
	}

	componentDidMount() {
		this.props.logout();
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => {
			dispatch(logout());
		}
	};
};

export default connect(
	null,
	mapDispatchToProps
)(LogoutView);
