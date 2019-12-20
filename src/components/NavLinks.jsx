import React from 'react';
import { Link } from 'gatsby';
import { Location } from '@reach/router';

const links = [
  {
    to: '/bill',
    label: 'What is the Tenant Protection Act?',
  },
  {
    to: '/eligibility',
    label: 'Am I Protected?',
  },
  {
    to: '/calculator',
    label: 'Rent Calculator',
  },
  // {
  //   to: '/resources',
  //   label: 'Resources',
  // },
  {
    to: '/about',
    label: 'About Us',
  },
]

const NavLinks = ({ showMenu }) => {
  const classes = 'nav-item nav-link';
  return (
    <Location>
      {({ location }) => {
        const linkItems = links.map((link) => (
          <Link key={link.to} className={`${classes}${location.pathname === link.to ? ' active' : ''}`} to={link.to}>
            {link.label}
          </Link>
        ))
        return (
          <div className={`navlink-group${showMenu ? ' active' : ''}`}>
            <div className="navbar-nav">
              {linkItems}
            </div>
          </div>
        )
      }}
    </Location>
  )
}

export default NavLinks;
