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
    console.log('hello')
    console.log(this.state.searchTerm)
    this.setState({isLoading: true})
    axios.post('http://localhost:8080/charitySearch',{
      searchTerm: this.state.searchTerm,
      eligible: 1
    })
    .then((res) => {
      console.log(res.data)
      this.setState({
        searchResults: res.data,
        searchTerm: '',
        isLoading: false
      })
      console.log(this.state.searchResults)
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
          {this.state.searchResults.map((charity, i) => 
            <CharitySearchResult key={i} info={charity} />)}
          </div>
        </div>
      </Header>
    );
  }
}

export default SearchPage;