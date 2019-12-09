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
import close from '../images/close.svg';
import NavLinks from './NavLinks';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
    this.toggleNavLinks = this.toggleNavLinks.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  toggleNavLinks() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  handleOutsideClick() {
    this.setState({ showMenu: false });
  }

  render() {
    return (
      <nav className={`navbar navbar-expand-lg navbar-light bg-light${this.state.showMenu ? ' active' : ''}`}>
        <div onClick={this.handleOutsideClick} className={`overlay${this.state.showMenu ? ' active' : ''}`} />
        <SEO title="Home" />
        <Link className="navbar-brand" to="/"><img alt="logo" src={logo} /></Link>
        <NavLinks />
        <div className={`hamburger${this.state.showMenu ? ' hidden' : ''}`} onClick={this.toggleNavLinks}>
          <img style={{ display: this.state.showMenu ? 'none' : 'block' }} alt="hamburger" src={hamburger} />
          <img style={{ display: this.state.showMenu ? 'block' : 'none' }} alt="close" src={close} />
          <NavLinks showMenu={this.state.showMenu} />
        </div>
        {/* TODO: Add spanish translation */}
        {/* <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
        <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton> */}
      </nav>
    );
  }
}

export default withTranslation()(Header);
