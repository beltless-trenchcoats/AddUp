import React, { Component } from 'react';
import { Navbar, FormGroup, FormControl, Button } from 'react-bootstrap'
import axios from 'axios';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchTerm: ''
    }
    this.getResults = this.getResults.bind(this)
  }

  getResults() {
    this.setState({isLoading: true})
    axios.get('http://localhost:8080/signup',{

    })
    .then((res) => {

    })
    .catch((err) => {
      console.log(err)
    })

  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Collapse>
            <Navbar.Form pullLeft>
              <FormGroup>
                <FormControl type="text" placeholder="Search" />
              </FormGroup>
              {this.state.searchTerm}
              <Button 
                type="submit" 
                disabled={this.state.isLoading}
                onSubmit={!this.state.isLoading ? this.getResults : null}>{this.state.isLoading ? 'Finding Causes...' : 'Find Cause'}
              </Button>
            </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default SearchPage;