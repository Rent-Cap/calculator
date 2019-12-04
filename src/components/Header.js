import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import SEO from './Seo';
import 'bootstrap/dist/css/bootstrap.css';
import { PrimaryButton, SecondaryButton } from './Buttons';
import i18n from '../i18n';
import { withTranslation } from 'react-i18next';
import logo from '../images/logo.svg';

const Header = ({ siteTitle, t }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <SEO title="Home" />
    <Link className="navbar-brand" to="/"><img src={logo} /></Link>
    {/* <div className="container"> */}
    <div className="TODO-Add-Hamburger" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link className="nav-item nav-link" to="/eligibility">
          {t('eligible')}
        </Link>
        <Link className="nav-item nav-link" to="/calculator">
          I'm eligible (Calculator)
        </Link>
        {/* <Link to="/resources">
          Resources
        </Link> */}
        <Link className="nav-item nav-link" to="/bill">
          About The Bill
        </Link>
        <Link className="nav-item nav-link" to="/about">
          About RentCap
        </Link>
      </div>
    </div>
    {/* </div> */}
    {/* TODO: Add spanish translation */}
    {/* <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
    <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton> */}
  </nav>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: 'Rent Cap',
};

export default withTranslation()(Header);
