import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import UserProfile from './userProfile';
import './index.css';

ReactDOM.render (
	<Router history={browserHistory}>
		<Route path="/" component={App}/>
    <Route path="/user" component={UserProfile} />
	</Router>,
  document.getElementById('root')
);
