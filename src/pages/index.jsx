import React from "react"
import { Link } from "gatsby";
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Layout from "../components/Layout"
import { PrimaryButton2, SecondaryButton } from "../components/Buttons";

const IndexPage = () => {
  return (
  <Layout>
    <div className="index row">
      <div className="index-cell col-md">
        <h1>Find out if you're protected</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <Link to="/eligibility"><PrimaryButton2>Am I Protected?</PrimaryButton2></Link>
      </div>
      <div className="image-container col-sm">
        <div className="hero-image"></div>
      </div>
    </div>
    <div className="index calculator row">
      <div className="image-container col-sm">
        <div className="calculator-image"></div>
      </div>
      <div className="index-cell col-lg">
        <h1>How much can my landlord charge in rent?</h1> 
        <p>Calculate how much rent is owed to you.</p>
        <Link to="/calculator"><PrimaryButton2>Am I Being Overcharged?</PrimaryButton2></Link>
      </div>
    </div>
    <div className="index row">
      <div className="index-cell col-lg">
        <h1>Need help defending your rights?</h1>
        <p>Download a pre-drafted letter, or find local resources.</p>
        <Link to="#"><SecondaryButton>Coming soon</SecondaryButton></Link>
      </div>
      <div className="image-container col-sm">
        <div className="lawyer-image"></div>
      </div>
    </div>
  </Layout>
  )
}

export default withTranslation()(IndexPage)
