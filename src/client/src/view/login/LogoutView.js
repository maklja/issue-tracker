import { Component } from 'react';

class LogoutView extends Component {
	render() {
		return '';
	}

	async componentDidMount() {
		await fetch('/api/logout', {
			method: 'POST'
		});

		this.props.onLogout();
	}
}

export default LogoutView;
