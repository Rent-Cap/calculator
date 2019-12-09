import { Link } from 'gatsby';
// import PropTypes from "prop-types"
import React from 'react';
import { withTranslation } from 'react-i18next';
import SEO from './Seo';
import 'bootstrap/dist/css/bootstrap.css';
// import { PrimaryButton, SecondaryButton } from '../components/Buttons'
// import i18n from '../i18n';
import logo from '../images/logo.svg';
import hamburger from '../images/hamburger.svg';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
    this.showNavLinks = this.showNavLinks.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  showNavLinks() {
    this.setState({ showMenu: true });
  }

  handleOutsideClick() {
    this.setState({ showMenu: false });
  }

  render() {
    return (
      <nav className={`navbar navbar-expand-lg navbar-light bg-light${this.state.showMenu ? ' active' : ''}`}>
        <div onClick={this.handleOutsideClick} className={`overlay${this.state.showMenu ? ' active' : ''}`} />
        <SEO title="Home" />
        <Link className={`navbar-brand${this.state.showMenu ? ' hidden' : ''}`} to="/"><img alt="logo" src={logo} /></Link>
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
            <Link className="nav-item nav-link" to="/resources">
              Resources (Coming Soon)
            </Link>
            <Link className="nav-item nav-link" to="/about">
              About Us
            </Link>
          </div>
        </div>
        <div className={`hamburger${this.state.showMenu ? ' hidden' : ''}`} onClick={this.showNavLinks}><img alt="hamburger" src={hamburger} /></div>
        {/* TODO: Add spanish translation */}
        {/* <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
        <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton> */}
      </nav>
    );
  }
}

export default withTranslation()(Header);
