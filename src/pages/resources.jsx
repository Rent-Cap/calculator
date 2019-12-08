import React from 'react';
import GenerateLetter from '../components/GenerateLetter';
import Layout from '../components/Layout';
import SEO from '../components/Seo';

const Resources = () => (
  <Layout>
    <SEO title="Resources" />
    <div>
      <h1>Generate a letter to your landlord</h1>
      <GenerateLetter />
    </div>
  </Layout>
);

export default Resources;
