import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import axios from 'axios';

import Header from './Header';
import CharitySearchResult from './CharitySearchResult'

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchTerm: '',
      searchCity: '',
      searchState: '',
      searchZip: '',
      searchCategory: '',
      searchResults: []
    }
    this.getResults = this.getResults.bind(this)
    this.onSearchInput = this.onSearchInput.bind(this)
  }

  onSearchInput (e) {
    this.setState({searchTerm: e.target.value});
  }

  onCityInput (e) {
    this.setState({searchCity: e.target.value});
  }

  handleSelect (evt,evtKey) {
      // what am I suppose to write in there to get the value?
    console.log('EVENT', evt);
  }

  getResults() {
    this.setState({isLoading: true})
    axios.post('http://localhost:8080/charitySearch',{
      searchTerm: this.state.searchTerm,
      eligible: 1
    })
    .then((res) => {
      this.setState({
        searchResults: res.data,
        searchTerm: '',
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
                    onChange={this.onSearchInput}
                  />
                  <DropdownButton bsStyle={'default'} title={'Category'} id={'categoryDropdown'} onSelect={this.handleSelect}>
                    <MenuItem eventKey="A">Arts, Culture and Humanities</MenuItem>
                    <MenuItem eventKey="B">Educational Institutions and Related Activities</MenuItem>
                    <MenuItem eventKey="C">Environmental Quality, Protection and Beautification</MenuItem>
                    <MenuItem eventKey="D">Animal-Related</MenuItem>
                    <MenuItem eventKey="E">Health - General and Rehabilitative</MenuItem>
                    <MenuItem eventKey="F">Mental Health, Crisis Intervention</MenuItem>
                    <MenuItem eventKey="G">Diseases, Disorders, Medical Disciplines</MenuItem>
                    <MenuItem eventKey="H">Medical Research</MenuItem>
                    <MenuItem eventKey="I">Crime, Legal-Related</MenuItem>
                    <MenuItem eventKey="J">Employment, Job-Related</MenuItem>
                    <MenuItem eventKey="K">Food, Agriculture and Nutrition</MenuItem>
                    <MenuItem eventKey="L">Housing, Shelter</MenuItem>
                    <MenuItem eventKey="M">Public Safety, Disaster Preparedness and Relief</MenuItem>
                    <MenuItem eventKey="N">Recreation, Sports, Leisure, Athletics</MenuItem>
                    <MenuItem eventKey="O">Youth Development</MenuItem>
                    <MenuItem eventKey="P">Human Services - Multipurpose and Other</MenuItem>
                    <MenuItem eventKey="Q">International, Foreign Affairs and National Security</MenuItem>
                    <MenuItem eventKey="R">Civil Rights, Social Action, Advocacy</MenuItem>
                    <MenuItem eventKey="S">Community Improvement, Capacity Building</MenuItem>
                    <MenuItem eventKey="T">Philanthropy, Voluntarism and Grantmaking Foundations</MenuItem>
                    <MenuItem eventKey="U">Science and Technology Research Institutes, Services</MenuItem>
                    <MenuItem eventKey="V">Social Science Research Institutes, Services</MenuItem>
                    <MenuItem eventKey="W">Public, Society Benefit - Multipurpose and Other</MenuItem>
                    <MenuItem eventKey="X">Religion-Related, Spiritual Development</MenuItem>
                    <MenuItem eventKey="Y">Mutual/Membership Benefit Organizations, Other</MenuItem>
                  </DropdownButton>
                  <FormControl 
                    type="text" 
                    placeholder="City"
                    onChange={this.onCityInput}
                  />
                  <FormControl 
                    type="text" 
                    placeholder="State (2 letter abbrev)"
                    onChange={this.onCityInput}
                  />
                  <FormControl 
                    type="text" 
                    placeholder="Zip Code"
                    onChange={this.onCityInput}
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