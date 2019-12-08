import React from 'react';
import github from '../images/github.svg';
import linkedin from '../images/linkedin.svg';

const linkTypeToImage = {
  github,
  linkedin,
};

const AttributionCard = ({
  name, photoUrl, title, description, links,
}) => {
  const linkList = links.map((link) => (
    <li key={link.href}>
      <a href={link.href}><img alt="social-link" src={linkTypeToImage[link.type]} /></a>
    </li>
  ));
  console.log('TODO: ', photoUrl);
  return (
    <div className="contributor card">
      <div className="portrait card-img-top" />
      <div className="card-body">
        <div className="contributor-header">
          <h4 className="card-title">
            {name}
          </h4>
          <small className="text-muted">{title}</small>
        </div>
        <p className="card-text">
          {description}
        </p>
      </div>
      <div className="card-footer">
        <ul className="social-links">
          {linkList}
        </ul>
      </div>
    </div>
  );
};

export default AttributionCard;
