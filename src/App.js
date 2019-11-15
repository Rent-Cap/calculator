import React from 'react';
import Calculator from './Calculator'
import logo from './logo.svg';
import { connect } from 'react-redux';
import './App.css';
import Footer from './components/Footer'
import FlowChart from './FlowChart'
import Resources from './Resources'
import { PrimaryButton, SecondaryButton } from './components/Buttons'

import {
  Switch,
  withRouter,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const text = this.props.languages[this.props.language]
    return (
        <div className="app-container">
          <div>
            <div className={(this.props.location.pathname === '/') ? 'top-nav hero' : 'top-nav'}>
              <div>
                <Link to="/">
                  <img src={logo} />
                </Link>
                <Link to="/flowchart">
                  <PrimaryButton>{text.nav.eligible}</PrimaryButton>
                </Link>
                <Link to="/calculator">
                  <PrimaryButton>I'm eligible (Calculator)</PrimaryButton>
                </Link>
                <Link to="/resources">
                  <PrimaryButton>Resources</PrimaryButton>
                </Link>
              </div>
              <div>
                <SecondaryButton onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'english'})}>English</SecondaryButton>
                <SecondaryButton onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'spanish'})}>Espanol</SecondaryButton>
              </div>
            </div>
            <div className="container">
              <Switch>
                <Route path="/calculator">
                  <Calculator />
                </Route>
                <Route path="/flowchart">
                  <FlowChart />
                </Route>
                <Route path="/resources">
                  <Resources />
                </Route>
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    languages: state.languages,
    language: state.language
  })
};

export default connect(mapStateToProps)(withRouter(App));
