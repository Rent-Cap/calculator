import React from 'react';
import Calculator from './Calculator'
import logo from './logo.svg';
import { connect } from 'react-redux';
import './App.css';
import FlowChart from './FlowChart'
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
            <div className={(this.props.location.pathname === '/home') ? 'top-nav hero' : 'top-nav'}>
              <div>
                <Link to="/home">
                  <img src={logo} />
                </Link>
                <Link to="/flowchart">
                  <button className="btn btn-outline-primary">{text.nav.eligible}</button>
                </Link>
                <Link to="/calculator">
                  <button className="btn btn-outline-primary">I'm eligible (Calculator)</button>
                </Link>
              </div>
              <div>
                <button className="btn btn-outline-secondary" onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'english'})}>English</button>
                <button className="btn btn-outline-secondary" onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'spanish'})}>Espanol</button>
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
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
    )
  }
}

const Footer = () => {
  return (
    <footer>Footer goes here</footer>
  )
}

const mapStateToProps = state => {
  return ({
    languages: state.languages,
    language: state.language
  })
};

export default connect(mapStateToProps)(withRouter(App));
