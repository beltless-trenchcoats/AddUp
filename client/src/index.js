import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import UserProfile from './UserProfile';
import PublicProfile from "./PublicProfile";
import SearchPage from './SearchPage';
import CharityProfilePage from "./CharityProfilePage";
import About from "./About";
import Contact from "./Contact";
import CustomCauseProfilePage from "./CustomCauseProfile";
import helpers from '../helpers';

function loggedIn() {
	var cookies = helpers.parseCookie(document.cookie);
	if(cookies.email !== undefined) {
		return true;
	} else {
		return false;
	}
}

function isAuth (nextState, replace) {
	if(!loggedIn()) {
		replace({
			pathname: '/'
		})
	}
}


ReactDOM.render (
	<Router history={browserHistory}>
		<Route path="/" component={App}/>
	    <Route path="/user" component={UserProfile} onEnter={isAuth} />
	    <Route path="/profile/:id" component={PublicProfile} />
	   	<Route path="/search" component={SearchPage} />
			<Route path="/about" component={About} />
			<Route path="/contact" component={Contact} />
	   	<Route path="/:type/:id" component={CharityProfilePage} />
      <Route path="/myCause/edit/:id" component={CustomCauseProfilePage} onEnter={isAuth} />
	</Router>,
  document.getElementById('root')
);
