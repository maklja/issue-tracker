import { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions/initActions';

class LogoutView extends Component {
	render() {
		return '';
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
