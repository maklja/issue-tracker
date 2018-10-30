import React from 'react';
import IssuePreview from '../issue/IssuePreview';

const HomePage = ({ user }) => {
	return (
		<div>
			<IssuePreview user={user} />
		</div>
	);
};

export default HomePage;
