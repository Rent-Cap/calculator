import React from 'react'
import GenerateLetter from './components/GenerateLetter'
import { withRouter } from 'react-router-dom'

const Resources = ({ location }) => (
  <div>
    {location.pathname === '/resources/local-ordinances' &&
      <div>
        <h1>Local Rent Control Ordinances</h1>
        <h2>TODO: Put local rent control ordinances here</h2>
      </div>
    }
    <h1>Generate a letter to your landlord</h1>
    <GenerateLetter />
  </div>
)

export default withRouter(Resources)