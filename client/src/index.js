import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import UserProfile from './UserProfile';
import SearchPage from './SearchPage';
import CharityProfilePage from "./CharityProfilePage";
import About from "./About";
import Contact from "./Contact";
import CustomCauseProfilePage from "./CustomCauseProfile";

ReactDOM.render (
	<Router history={browserHistory}>
		<Route path="/" component={App}/>
	    <Route path="/user" component={UserProfile} />
	   	<Route path="/search" component={SearchPage} />
			<Route path="/about" component={About} />
			<Route path="/contact" component={Contact} />
	   	<Route path="/:type/:id" component={CharityProfilePage} />
      <Route path="/myCause/:id" component={CustomCauseProfilePage} />
	</Router>,
  document.getElementById('root')
);
