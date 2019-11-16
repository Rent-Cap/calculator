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
    const { t, i18n, changeZip, zip } = this.props
    return (
      <div className="app-container">
        <div>
          <div className={(this.props.location.pathname === '/') ? 'top-nav hero' : 'top-nav'}>
            <div>
              <Link to="/">
                <img src={logo} />
              </Link>
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
        <div style={{display: 'flex', 'flex-direction': 'column', 'align-items': 'center'}}>
          <div style={{display: 'flex', 'flex-direction': 'column', width: '200px', 'align-items': 'center'}}>
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
