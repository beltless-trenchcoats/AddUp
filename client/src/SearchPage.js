import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import axios from 'axios';

import Header from './Header';
import CharitySearchResult from './CharitySearchResult'

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchTerm: '',
      searchResults: []
    }
    this.getResults = this.getResults.bind(this)
    this.onSearchInput = this.onSearchInput.bind(this)
  }

  onSearchInput (e) {
    this.setState({searchTerm: e.target.value})
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
                <FormGroup>
                  <FormControl 
                    type="text" 
                    placeholder="Search"
                    onChange={this.onSearchInput}
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
            <p className="noResults">There are no charities for that search, please try another search Term</p>
            : this.state.searchResults.map((charity, i) => 
            <CharitySearchResult key={i} info={charity} />)}
          </div>
        </div>
      </Header>
    );
  }
}

export default SearchPage;