import React from 'react';
import Calculator from './Calculator'
import logo from './logo.svg';
import './App.css';
import Footer from './components/Footer'
import FlowChart from './FlowChart'
import Resources from './Resources'
import { PrimaryButton, SecondaryButton } from './components/Buttons'
import { withTranslation } from 'react-i18next';
import withRedux from './withRedux';

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
    const { t, i18n, changeZip, location, zip } = this.props
    return (
      <div className="app-container">
        <div>
          <div className={(location.pathname === '/') ? 'top-nav hero' : 'top-nav'}>
            <div className="top-nav-link-container">
              <Link to="/">
                <img alt="Rent Cap Logo" src={logo} />
              </Link>
              <div className="nav-links">
                <Link to="/flowchart">
                  <PrimaryButton>{t('eligible')}</PrimaryButton>
                </Link>
                <Link to="/calculator">
                  <PrimaryButton>I'm eligible (Calculator)</PrimaryButton>
                </Link>
                <Link to="/resources">
                  <PrimaryButton>Resources</PrimaryButton>
                </Link>
              </div>
            </div>
            <div>
              <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
              <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton>
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
        {/* Zipcode is mainly to demonstrate how to dispatch to the redux store */}
        <div style={{display: 'flex', marginTop: '50px', 'flexDirection': 'column', 'alignItems': 'center'}}>
          <div style={{display: 'flex', 'flexDirection': 'column', width: '200px', 'alignItems': 'center'}}>
            <input placeholder="enter your zipcode" value={zip} onChange={(e) => changeZip(e.target.value)}/>
            <small>Zipcode</small>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default withRedux(withRouter(withTranslation()(App)));
