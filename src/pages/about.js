import React from 'react'
import Layout from '../components/Layout'
import SEO from "../components/Seo"

const About = () => (
  <Layout>
    <SEO title="About" />
    <h1>About</h1>
    <h2>Who built the site</h2>
    <p>This site was built by the Code For San Francisco Brigade and the Tech Equity Collaborative with legal help from Community Legal Services in East Palo Alto.</p>
    <h2>How can I contribute</h2>
    <p>Join the #rentcap channel in the Code For San Francisco slack (<a href="http://c4sf.me">c4sf.me</a>) or make pull requests directly through our <a href="https://github.com/Rent-Cap/">github organization</a></p>
  </Layout>
)

export default About