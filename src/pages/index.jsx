import React from 'react';
import { Link } from 'gatsby';
import { withTranslation } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
// import person from '../images/person.svg'
// import calc from '../images/calc.svg'
// import home from '../images/home.svg'
import interiorUndraw from '../images/interior_undraw.svg'
import calcUndraw from '../images/calculator_undraw.svg'
import helpUndraw from '../images/helpful_undraw.svg'

import Layout from '../components/Layout';
import { PrimaryButton2, SecondaryButton } from '../components/Buttons';

const IndexPage = () => (
  <Layout>
    <div className="index row">
      <div className="index-cell col-md">
        <h1>Find out if you&apos;re protected</h1>
        <p>
        The Tenant Protection Act protects a majority of California&apos;s renters against
        unfair rent increases and unjust evictions.
        However, not everyone is eligible for these protections.
        Use our tool to help determine if you&apos;re covered by this new law.
        </p>
        <Link to="/eligibility"><PrimaryButton2>Am I Protected?</PrimaryButton2></Link>
      </div>
      <div className="image-container col-sm">
        <img alt="house" src={interiorUndraw} />
      </div>
    </div>
    <div className="index calculator row">
      <div className="image-container col-sm">
        <img alt="calc" src={calcUndraw} />
      </div>
      <div className="index-cell col-lg">
        <h1>How much can my landlord charge in rent?</h1>
        <p>
          If you already know you&apos;re protected by the Tenant Protection Act,
          our tool can help you make sure you&apos;re not being overcharged for your rent.
        </p>
        <Link to="/calculator"><PrimaryButton2>Am I Being Overcharged?</PrimaryButton2></Link>
      </div>
    </div>
    <div className="index row">
      <div className="index-cell col-lg">
        <h1>Need help defending your rights?</h1>
        <p>
          Do you still have questions and need further support?
          If you are facing an eviction or rent increases, or if you&apos;re under threat of either,
          our resources can help you get the support you need in defending your rights.
        </p>
        <Link to="#"><SecondaryButton>Coming soon</SecondaryButton></Link>
      </div>
      <div className="image-container col-sm">
        <img alt="lawyer" src={helpUndraw} />
      </div>
    </div>
  </Layout>
);

export default withTranslation()(IndexPage);
