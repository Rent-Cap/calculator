import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/Seo';
import tec from '../images/tec.png'
import cls from '../images/cls.png'
import acce from '../images/acce.png'
import c4sf from '../images/c4sf.png'
// import AttributionCard from '../components/AttributionCard';

const About = () => (
  <Layout>
    <SEO title="About" />
    <h1>About</h1>
    <h2>Who built the site</h2>
    <img src={tec} alt="tec" />
    <img src={cls} alt="cls" />
    <img src={acce} alt="acce" height="82" />
    <img src={c4sf} alt="c4sf" height="82" />
    <p>
This site was built by the Code For San Francisco Brigade and the Tech Equity Collaborative
      with legal help from Community Legal Services in East Palo Alto.
    </p>
    {/* <AttributionCard
      name="John Doe"
      description="Contributed by writing code for the website"
      title="Product Manager"
      links={[{ type: 'github', href: 'www.gh.com' }, { type: 'linkedin', href: 'www.li.com' }]}
    />
    */}
    <h2>How can I contribute</h2>
    <p>
Join the #rentcap channel in the Code For San Francisco slack (
      <a href="http://c4sf.me">c4sf.me</a>
) or make pull requests directly through our
      <a href="https://github.com/Rent-Cap/">github organization</a>
    </p>
  </Layout>
);

export default About;
