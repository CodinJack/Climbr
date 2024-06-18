import React from 'react';

export default function Navbar() {
  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-4 bg-dark text-white">
      <a className="navbar-brand text-white" href="#">Navbar w/ text</a>
      <span className="text-white">Navbar text with an inline element</span>
    </div>
  );
}
