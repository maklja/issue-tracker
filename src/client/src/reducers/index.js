import { combineReducers } from 'redux';

import initReducer from './init/initReducer';
import issueReducer from './issue/issueReducer';
import statusReducer from './status/statusReducer';
import userReducer from './user/userReducer';

const rootReducer = combineReducers({
	init: initReducer,
	issueData: issueReducer,
	statusData: statusReducer,
	userData: userReducer
});

export default rootReducer;
