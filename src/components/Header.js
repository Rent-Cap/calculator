import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import SEO from "../components/Seo"
import 'bootstrap/dist/css/bootstrap.css';
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import i18n from '../i18n';
import { withTranslation } from 'react-i18next';
import logo from '../images/logo.svg'
const Header = ({ siteTitle, t }) => (
  <header>
    <SEO title="Home" />
    <Link to="/"><img src={logo}></img></Link>
    <Link to="/flowchart">
      <PrimaryButton>{t('eligible')}</PrimaryButton>
    </Link>
    <Link to="/calculator">
      <PrimaryButton>I'm eligible (Calculator)</PrimaryButton>
    </Link>
    <Link to="/resources">
      <PrimaryButton>Resources</PrimaryButton>
    </Link>
    <SecondaryButton onClick={() => i18n.changeLanguage('en')}>English</SecondaryButton>
    <SecondaryButton onClick={() => i18n.changeLanguage('es')}>Espanol</SecondaryButton>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: `Rent Cap`,
}

export default withTranslation()(Header)
