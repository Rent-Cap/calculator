import React from "react"

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Layout from "../components/Layout"
import { withTranslation } from 'react-i18next';

const IndexPage = ({ t }) => {
  return (
  <Layout>
    <h1>Welcome.</h1>
  </Layout>
  )
}

export default withTranslation()(IndexPage)
