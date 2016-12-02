import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import UserProfile from './UserProfile';
import PublicProfile from './PublicProfile';
import SearchPage from './SearchPage';
import CharityProfilePage from './CharityProfilePage';
import About from './About';
import Contact from './Contact';
import CustomCauseProfilePage from './CustomCauseProfile';
import helpers from '../helpers';

//checks for cookies to see if a user is loggedIn
var loggedIn = function() {
  var cookies = helpers.parseCookie(document.cookie);
  if (cookies.email !== undefined) {
    return true;
  } else {
    return false;
  }
};

//if user has a http connection then redirect to https
var secureConnection = function() {
//CHANGE HTTP TO HTTPS FOR DEVELOPMENT
  if (window.location.protocol === 'http:') {
    window.location.protocol = 'https:';
  }
};

//if a user is not logged in redirect them to homepage
var isAuth = function(nextState, replace) {
  secureConnection();
  if (!loggedIn()) {
    replace ({
      pathname: '/'
    });
  }
};

//onEnter is calling above functions and waits for result before loading the page
ReactDOM.render (
	<Router history={browserHistory}>
		<Route path="/" component={App} onEnter={secureConnection}/>
    <Route path="/user" component={UserProfile} onEnter={isAuth} />
    <Route path="/profile/:id" component={PublicProfile} onEnter={secureConnection} />
    <Route path="/search" component={SearchPage} onEnter={secureConnection} />
		<Route path="/about" component={About} onEnter={secureConnection}/>
		<Route path="/contact" component={Contact} onEnter={secureConnection}/>
    <Route path="/:type/:id" component={CharityProfilePage} onEnter={secureConnection}/>
    <Route path="/myCause/edit/:id" component={CustomCauseProfilePage} onEnter={isAuth} />
	</Router>,
  document.getElementById('root')
);
