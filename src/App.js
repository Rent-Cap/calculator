import React from 'react';
import Calculator from './Calculator'
import logo from './logo.svg';
import { connect } from 'react-redux';
import './App.css';
import FlowChart from './FlowChart'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCalculator: false,
      showEligible: false,
    }
  }
  render() {
    const text = this.props.languages[this.props.language]
    return (
      <div className="app-container">
        <div>
          <div className={(!this.state.showCalculator && !this.state.showEligible) ? 'top-nav hero' : 'top-nav'}>
            <div>
              <img onClick={() => this.setState({showCalculator: false, showEligible: false})} src={logo}>
              </img>
              <button className="btn btn-outline-primary" onClick={() => this.setState({showCalculator: false, showEligible: true})}>{text.nav.eligible}</button>
              <button className="btn btn-outline-primary" onClick={() => this.setState({showEligible: false, showCalculator: true})}>I'm eligible (Calculator)</button>
            </div>
            <div>
              <button className="btn btn-outline-secondary" onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'english'})}>English</button>
              <button className="btn btn-outline-secondary" onClick={() => this.props.dispatch({type: 'CHANGE_LANGUAGE', language: 'spanish'})}>Espanol</button>
            </div>
          </div>
          <div className="container">
          {this.state.showCalculator &&
            <Calculator />
          }
          {this.state.showEligible &&
            <FlowChart />
          }
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

export default connect(mapStateToProps)(App);
