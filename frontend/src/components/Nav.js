import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 fixed-top shadow w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="text-3xl font-bold text-purple-400" to="/">Climbr.</Link>
        <ul className="hidden lg:flex space-x-12">
          <li>
            <Link className="text-lg font-semibold text-gray-300 hover:text-purple-200 transition-colors" to="/">Tasks</Link>
          </li>
          <li>
            <Link className="text-lg font-semibold text-gray-300 hover:text-purple-200 transition-colors" to="/employees">Employees</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
