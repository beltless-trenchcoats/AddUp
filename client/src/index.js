import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import UserProfile from './UserProfile';
import SearchPage from './SearchPage';
import CharityProfilePage from "./CharityProfilePage";

ReactDOM.render (
	<Router history={browserHistory}>
		<Route path="/" component={App}/>
	    <Route path="/user" component={UserProfile} />
	   	<Route path="/search" component={SearchPage} />
	   	<Route path="/charity/:id" component={CharityProfilePage} />
	</Router>,
  document.getElementById('root')
);
