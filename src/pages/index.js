import React from "react"

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Layout from "../components/Layout"
import { withTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { Link } from "gatsby";

const IndexPage = ({ t }) => {
  return (
  <Layout>
    <div className="index row">
      <div className="col-md">
        <h1>Find out if your rent is protected</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <ol>
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</li>
          <li>incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt</li>
        </ol>
        <Link to="/eligibility"><PrimaryButton>Am I Eligible?</PrimaryButton></Link>
      </div>
      <div className="image-container col-sm">
        <div className="hero-image"></div>
      </div>
    </div>
    <div className="index calculator row">
      <div className="image-container col-sm">
        <div className="calculator-image"></div>
      </div>
      <div className="col-lg">
        <h2>Already qualified?</h2> 
        <p>Calculate how much rent is owed to you.</p>
        <Link to="/calculator"><PrimaryButton>Calculate My Refund</PrimaryButton></Link>
      </div>
    </div>
    <div className="index row">
      <div className="col-lg">
        <h2>Need help from a lawyer?</h2>
        <p>Download a pre-drafted letter, or find local resources.</p>
        <Link to="#"><SecondaryButton>Coming soon</SecondaryButton></Link>
      </div>
      <div className="col-sm">
        <div className="lawyer-image"></div>
      </div>
    </div>
  </Layout>
  )
}

export default withTranslation()(IndexPage)
