import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link className="text-2xl font-bold text-gray-800" to="/">Climbr.</Link>
        <button 
          className="navbar-toggler p-2 text-gray-600 lg:hidden" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon">☰</span>
        </button>
        <div className="collapse navbar-collapse lg:flex lg:items-center" id="navbarNav">
          <ul className="flex flex-col lg:flex-row lg:ml-auto lg:space-x-6">
            <li className="nav-item">
              <Link className="nav-link text-lg text-gray-800 hover:text-blue-600 transition-colors" to="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-lg text-gray-800 hover:text-blue-600 transition-colors" to="/employees">Employees</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
