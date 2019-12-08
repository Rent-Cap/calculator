import React from 'react';

export const PrimaryButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn btn-outline-primary">{children}</button>
);
export const PrimaryButton2 = ({onClick, children}) => (
  <button onClick={onClick} className="btn btn-primary">{children}</button>
)
export const SecondaryButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn btn-outline-secondary">{children}</button>
);
export const SuccessButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn btn-outline-success">{children}</button>
);
export const DangerButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn btn-outline-danger">{children}</button>
);
