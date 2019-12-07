import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"
import SEO from "../components/Seo"
import 'bootstrap/dist/css/bootstrap.css';
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import i18n from '../i18n';
import { withTranslation } from 'react-i18next';
import logo from '../images/logo.svg'
import hamburger from '../images/hamburger.svg'

class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      showMenu: false,
    }
    this.showNavLinks = this.showNavLinks.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }
  showNavLinks(e) {
    this.setState({ showMenu: true })
  }
  handleOutsideClick(e) {
    this.setState({ showMenu: false})
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div onClick={this.handleOutsideClick} className={`overlay${this.state.showMenu ? ' active' : ''}`}></div>
        <SEO title="Home" />
        <Link className={`navbar-brand${this.state.showMenu ? ' hidden' : ''}`} to="/"><img src={logo}></img></Link>
        {/* <div className="container"> */}
        <div className={`navlink-group${this.state.showMenu ? ' active' : ''}`}>
          <div className="navbar-nav">
            <Link className="nav-item nav-link" to="/bill">
              What is the Tenant Protection Act?
            </Link>
            <Link className="nav-item nav-link" to="/eligibility">
              Am I Protected
            </Link>
            <Link className="nav-item nav-link" to="/calculator">
              Rent Calculator
            </Link>
            <Link className="nav-item nav-link">
              Resources (Coming Soon)
            </Link>
            <Link className="nav-item nav-link" to="/about">
              About Us
            </Link>
          </div>
        </div>
        <div className={`hamburger${this.state.showMenu ? ' hidden' : ''}`} onClick={this.showNavLinks}><img src={hamburger}></img></div>
        {/* </div> */}
        {/* TODO: Add spanish translation */}
        {/* <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
        <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton> */}
      </nav>
      )
  }
} 

export default withTranslation()(Header)
