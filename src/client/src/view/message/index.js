import React from 'react';

import './Message.css';

export const Message = ({ type, message, error }) => {
	return (
		<div className="message">
			{type ? <div className={`message-${type}`}>{message}</div> : ''}
		</div>
	);
};
