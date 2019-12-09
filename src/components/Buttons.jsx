import React from 'react';

export const PrimaryButton = ({ onClick, children, style }) => (
  <button type="button" onClick={onClick} style={style} className="btn btn-outline-primary">{children}</button>
);
export const PrimaryButton2 = ({ onClick, children, style }) => (
  <button type="button" onClick={onClick} style={style} className="btn btn-primary">{children}</button>
);
export const SecondaryButton = ({ onClick, children, style }) => (
  <button type="button" onClick={onClick} style={style} className="btn btn-outline-secondary">{children}</button>
);
export const SuccessButton = ({ onClick, children, style }) => (
  <button type="button" onClick={onClick} style={style} className="btn btn-outline-success">{children}</button>
);
export const DangerButton = ({ onClick, children, style }) => (
  <button type="button" onClick={onClick} style={style} className="btn btn-outline-danger">{children}</button>
);
