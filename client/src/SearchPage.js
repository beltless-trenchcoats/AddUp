import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import axios from 'axios';

import Header from './Header';
import CharitySearchResult from './CharitySearchResult';
import './searchPage.css';

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
      categoryName: '',
      searchResults: []
    }
    this.getResults = this.getResults.bind(this)
    this.onSearchInput = this.onSearchInput.bind(this)
  }

  onSearchInput (type, e) {
    var stateChange = {};
    stateChange[type] = e.target.value;
    this.setState(stateChange);
  }

  handleSelect (evt,evtKey) {
      // what am I suppose to write in there to get the value?
    console.log('EVENT', evt);
    this.setState({category: evt[0], categoryName: evt[1]});
  }

  getResults() {
    this.setState({isLoading: true});
    var searchTerms = {
      eligible: 1
    };
    var options = ['searchTerm', 'city', 'state', 'zipCode', 'category'];
    for (var i = 0; i < options.length; i ++) {
      if (this.state[options[i]] !== '') {
        searchTerms[options[i]] = this.state[options[i]]
      }
    }

    console.log('search terms', searchTerms);
    axios.post('http://localhost:8080/charitySearch', searchTerms)
    .then((res) => {
      this.setState({
        searchResults: res.data,
        isLoading: false
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    return (
      <Header>
        <div className="searchPage">
          <Navbar>
            <Navbar.Collapse>
              <Navbar.Form pullLeft >
                <div>Fill in one of more fields and find your charity!</div> 
                <FormGroup>
                  <FormControl 
                    type="text" 
                    placeholder="Search"
                    onChange={this.onSearchInput.bind(this, 'searchTerm')}
                  />
                  <DropdownButton bsStyle={'default'} class="dropdownCat" title={this.state.categoryName || 'Category'} id={'categoryDropdown'} onSelect={this.handleSelect.bind(this)}>
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
                    onChange={this.onSearchInput.bind(this, 'city')}
                  />
                  <FormControl 
                    type="text" 
                    placeholder="State (2 letter abbrev)"
                    onChange={this.onSearchInput.bind(this, 'state')}
                  />
                  <FormControl 
                    type="text" 
                    placeholder="Zip Code"
                    onChange={this.onSearchInput.bind(this, 'zipCode')}
                  />
                </FormGroup>
                <Button 
                  type="submit" 
                  disabled={this.state.isLoading}
                  onClick={!this.state.isLoading ? this.getResults : null}>{this.state.isLoading ? 'Finding Causes...' : 'Find Cause'}
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
        </div>
      </Header>
    );
  }
}

export default SearchPage;