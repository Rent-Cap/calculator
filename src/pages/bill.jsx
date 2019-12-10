/* eslint-disable */
import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/Seo';

const About = () => (
  <Layout>
    <SEO title="Bill" />
    <h1>What is the Tenant Protection Act </h1>
    <p>
    The Tenant Protection Act (Assembly Bill 1482) takes effect January 1, 2019 providing unprecedented new protections for a majority of California renters. The law was sponsored by a broad coalition of tenant advocates across the state.
  Under the Tenant Protection Act, eligible renters are covered in two major ways:
    </p>
    <ol>
      <li>Renters are protected from unjust evictions</li>
      <li>Renters are protected against unfair rent increases.</li> 
    </ol>
    <h2>Protections from Unjust Evictions</h2>
    <p>
      Under the Tenant Protection Act, eligible renters are protected from unjust evictions. This means your landlord must have a valid reason for evicting you.
    </p>
    {/* <div className="evictions-container">
      <div>
        <h3>At Fault</h3>
      </div>
      <div>
        <h3>No Fault</h3>
      </div>
    </div> */}
    <h2>Protections Against Unfair Rent Increases</h2>
    <p>
      Eligible renters are protected against rent increases that exceed 10% in a one year period or the cost of living + 5%, whichever is lower. This is often referred to as a “rent-cap” because it caps the amount your landlord can legally increase your rent year after year.
      If you’re unsure if your rent increase exceeds the limit set by the law, our rent calculator can help you do the math. 
  </p>
  </Layout>
);

export default About;
