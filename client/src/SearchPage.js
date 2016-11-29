import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import $ from "jquery";
import { browserHistory } from 'react-router';

import Header from './Header';
import CharitySearchResult from './CharitySearchResult';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchTerm: '',
      city: '',
      state: '',
      zipCode: '',
      category: '',
      start: 0,
      categoryName: '',
      type: 'Charity',
      searchResults: [],
      activePage: 1,
      lastPage: 1,
      firstPageChange: false
    }
    this.getResults = this.getResults.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.navigateBySearchTerms = this.navigateBySearchTerms.bind(this);
    this.search = this.search.bind(this);
  }

<<<<<<< HEAD
  componentDidMount() {
    this.getResults();
    //if navigating between search results, re-render results
    $(window).on('hashchange', () => this.getResults());
  }

  onSearchInput(type, e) {
    this.setStateWithObj(type, e.target.value);
  }

  setStateWithObj(key, val) {
    var obj = {};
    obj[key] = val;
    this.setState(obj);
  }


  onSearchInput (type, e) {
    var stateChange = {};
    stateChange[type] = e.target.value;
    this.setState(stateChange);
  }

  handleSelect (evt,evtKey) {
    // what am I suppose to write in there to get the value?
    console.log('EVENT', evt);

    if(evt[1].split('').length > 25) {
      evt[1] = evt[1].substring(0, 25) + '...';
    }
    this.setState({category: evt[0], categoryName: evt[1]});
  }

  handleTypeSelect(evt) {
    this.setState({type: evt});
  }

  search() {
    this.navigateBySearchTerms(true);
  }

  navigateBySearchTerms() {
    var options = ['searchTerm', 'city', 'state', 'zipCode', 'category', 'start'];
    var queryStr = '';
    for (var i = 0; i < options.length; i++) {
      if (this.state[options[i]] !== '') {
        if (queryStr !== '') {
          queryStr += '&';
        }
        //if this is a new search, start 'start' back at 0
        if (options[i] === 'start' && arguments[0]) {
          queryStr += options[i] + '=0';
        } else if (options[i] === 'state') {
          queryStr += options[i] + '=' + this.state[options[i]].toUpperCase();
        }
        else queryStr += options[i] + '=' + this.state[options[i]];
      }
    }
    browserHistory.push('/search#' + queryStr);
    this.getResults();
  }

  getResults() {
    if (document.location.hash) {
      this.setState({isLoading: true});
      var searchTerms = {
          eligible: 1,
          type: this.state.type,
          private: 'false'
        };

      var searchFields = document.location.hash.slice(1).split('&');
      searchFields.forEach(pair => {
        var keyVal = pair.split('=');
        searchTerms[keyVal[0]] = keyVal[1];
        this.setStateWithObj(keyVal[0], keyVal[1]);
      });

      axios.post('http://localhost:8080/api/charities/search', searchTerms)
      .then((res) => {
        this.setState({
          searchResults: res.data,
          isLoading: false
        }, function() {
          this.state.searchResults.map((charity, i) => {
            <CharitySearchResult key={i} info={charity} />
          }))
        }
      }
      .catch((err) => {
        console.log(err)
      })
    }
  }
  //this function is called by ReactPaginate component
  pageSelect = (data) => {
    //previous start is what rows to request from the api
    var previousStart = parseInt(this.state.start);
    //array of previous results
    let previousResults = this.state.lastPageContents;
    //activePage is the current selected page
    let activePage = data.selected;
    //lastActivePage is the last page the user selected
    let lastActivePage = this.state.lastPage;
    //these two are set for future use in if statements
    let pageDifference = undefined;
    let resultDifference = 0;
    //on first select if statement will be called, it moves activePage up but leaves
    //lastPage at 1 still
    if(activePage - lastActivePage === 0 && this.state.firstPageChange === false) {
      //sets activePage state up 1 and firstPageChange state to false
      this.setState({activePage: activePage += 1, start: previousStart += 20, firstPageChange: true},
        function() {
          //gets results from API
          this.navigateBySearchTerms();
            this.getResults.call(this);
        })
    //gets called when the user increments up in numbers like 1 -> 2
    } else if(activePage >= lastActivePage && this.state.firstPageChange === false) {
      pageDifference = activePage - lastActivePage;
      this.setState({activePage: activePage += pageDifference, start: previousStart += (activePage - lastActivePage) * 20,
      firstPageChange: true},
        function() {
            this.navigateBySearchTerms();
            this.getResults.call(this);
        })
    } else if(activePage > lastActivePage) {
      //pageDifference is if the user skips from 1 -> 9 so we can Calculate where to
      //start the API call
      pageDifference = activePage - lastActivePage;
      //resultDifference uses pageDifference and multiplies it by 20
      resultDifference = (pageDifference * 20);
      if(pageDifference >= 2) {
        this.setState({activePage: activePage += pageDifference, start: previousStart += resultDifference - 20,
          lastPage: lastActivePage += pageDifference},
          function() {
            this.navigateBySearchTerms();
            this.getResults.call(this);
          });
      } else {
        this.setState({activePage: activePage += pageDifference, start: previousStart += resultDifference,
          lastPage: lastActivePage += pageDifference},
          function() {
            this.navigateBySearchTerms();
            this.getResults.call(this);
          });
      }
    //this route is for when users go down 1 by 1, eventually lastActivePage and activePage will be =
    } else if(activePage === lastActivePage) {
      this.setState({activePage: activePage -= 1, start: previousStart -= 20},
        function() {
          this.navigateBySearchTerms();
          this.getResults.call(this);
        });
    //else if the user is making steps down 5 -> 4, etc...
    } else {
      //same concept as stepping up but in reverse order
      pageDifference = lastActivePage - activePage;
      resultDifference = pageDifference * 20;
      this.setState({activePage: activePage -= pageDifference, start: previousStart -= resultDifference,
         lastPage: lastActivePage -= pageDifference},
      function() {
        this.navigateBySearchTerms();
        this.getResults.call(this);
      });
    }
}

  render() {
    return (
      <Header>
        <div className="searchPage">
          <Navbar>
            <Navbar.Collapse>
              <Navbar.Form pullLeft >
                <div>Fill in one of more fields and find your charity!</div>
                <FormGroup className="dropdownCat">
                  <FormControl
                    type="text"
                    placeholder="Search"
                    value={this.state.searchTerm}
                    onChange={this.onSearchInput.bind(this, 'searchTerm')}
                  />
                  <DropdownButton bsStyle={'default'} title={this.state.categoryName || 'Category'} id={'categoryDropdown'} onSelect={this.handleSelect.bind(this)}>
                    <MenuItem eventKey={["", 'Category']}>Category</MenuItem>
                    <MenuItem eventKey={["A", 'Arts, Culture and Humanities']}>Arts, Culture and Humanities</MenuItem>
                    <MenuItem eventKey={["B", 'Educational Institutions and Related Activities']}>Educational Institutions and Related Activities</MenuItem>
                    <MenuItem eventKey={["C", 'Environmental Quality, Protection and Beautification']}>Environmental Quality, Protection and Beautification</MenuItem>
                    <MenuItem eventKey={["D", 'Animal-Related']}>Animal-Related</MenuItem>
                    <MenuItem eventKey={["E", 'Health - General and Rehabilitative']}>Health - General and Rehabilitative</MenuItem>
                    <MenuItem eventKey={["F", 'Mental Health, Crisis Intervention']}>Mental Health, Crisis Intervention</MenuItem>
                    <MenuItem eventKey={["G", 'Diseases, Disorders, Medical Disciplines']}>Diseases, Disorders, Medical Disciplines</MenuItem>
                    <MenuItem eventKey={["H", 'Medical Research']}>Medical Research</MenuItem>
                    <MenuItem eventKey={["I", 'Crime, Legal-Related']}>Crime, Legal-Related</MenuItem>
                    <MenuItem eventKey={["J", 'Employment, Job-Related']}>Employment, Job-Related</MenuItem>
                    <MenuItem eventKey={["K", 'Food, Agriculture and Nutrition']}>Food, Agriculture and Nutrition</MenuItem>
                    <MenuItem eventKey={["L", 'Housing, Shelter']}>Housing, Shelter</MenuItem>
                    <MenuItem eventKey={["M", 'Public Safety, Disaster Preparedness and Relief']}>Public Safety, Disaster Preparedness and Relief</MenuItem>
                    <MenuItem eventKey={["N", 'Recreation, Sports, Leisure, Athletics']}>Recreation, Sports, Leisure, Athletics</MenuItem>
                    <MenuItem eventKey={["O", 'Youth Development']}>Youth Development</MenuItem>
                    <MenuItem eventKey={["P", 'Human Services - Multipurpose and Other']}>Human Services - Multipurpose and Other</MenuItem>
                    <MenuItem eventKey={["Q", 'International, Foreign Affairs and National Security']}>International, Foreign Affairs and National Security</MenuItem>
                    <MenuItem eventKey={["R", 'Civil Rights, Social Action, Advocacy']}>Civil Rights, Social Action, Advocacy</MenuItem>
                    <MenuItem eventKey={["S", 'Community Improvement, Capacity Building']}>Community Improvement, Capacity Building</MenuItem>
                    <MenuItem eventKey={["T", 'Philanthropy, Voluntarism and Grantmaking Foundations']}>Philanthropy, Voluntarism and Grantmaking Foundations</MenuItem>
                    <MenuItem eventKey={["U", 'Science and Technology Research Institutes, Services']}>Science and Technology Research Institutes, Services</MenuItem>
                    <MenuItem eventKey={["V", 'Social Science Research Institutes, Services']}>Social Science Research Institutes, Services</MenuItem>
                    <MenuItem eventKey={["W", 'Public, Society Benefit - Multipurpose and Other']}>Public, Society Benefit - Multipurpose and Other</MenuItem>
                    <MenuItem eventKey={["X", 'Religion-Related, Spiritual Development']}>Religion-Related, Spiritual Development</MenuItem>
                    <MenuItem eventKey={["Y", 'Mutual/Membership Benefit Organizations, Other']}>Mutual/Membership Benefit Organizations, Other</MenuItem>
                  </DropdownButton>
                  <FormControl
                    type="text"
                    placeholder="City"
                    value={this.state.city}
                    onChange={this.onSearchInput.bind(this, 'city')}
                  />
                  <FormControl
                    type="text"
                    className='form-control'
                    placeholder="State (2 letter abbrev)"
                    value={this.state.state}
                    onChange={this.onSearchInput.bind(this, 'state')}
                  />
                  <FormControl
                    type="text"
                    placeholder="Zip Code"
                    value={this.state.zipCode}
                    onChange={this.onSearchInput.bind(this, 'zipCode')}
                  />
                  <DropdownButton bsStyle={'default'} title={this.state.type || 'Charity'} id={'typeDropdown'} onSelect={this.handleTypeSelect.bind(this)}>
                    <MenuItem eventKey={'Charity'}>Charity</MenuItem>
                    <MenuItem eventKey={'Custom Cause'}>Custom Cause</MenuItem>
                  </DropdownButton>
                </FormGroup>
                <Button
                  type="submit"
                  disabled={this.state.isLoading}
                  onClick={!this.state.isLoading ? this.search : null}>{this.state.isLoading ? 'Finding Causes...' : 'Find Cause'}
                </Button>
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>

          <div className="results">
            {(this.state.searchResults.length === 0) ?
            <p className="noResults">There are no charities for that search, please try another search</p>
            : this.state.searchResults.map((charity, i) =>
            <CharitySearchResult key={i} info={charity} />)}
          </div>
          <div className="pagination">
            {(this.state.searchResults.length !== 0) ?
              <ReactPaginate previousLabel={"previous"}
                 nextLabel={"next"}
                 breakLabel={<a href="">...</a>}
                 breakClassName={"break-me"}
                 marginPagesDisplayed={2}
                 pageRangeDisplayed={5}
                 clickCallback={this.pageSelect.bind(this)}
                 containerClassName={"pagination"}
                 subContainerClassName={"pages pagination"}
                 activeClassName={"active"} />
              : null
            }
          </div>
        </div>
      </Header>
    );
  }
}

export default SearchPage;
