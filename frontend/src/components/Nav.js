import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="text-3xl font-bold text-blue-600" to="/">Climbr.</Link>
        <div className="hidden lg:flex lg:items-center">
          <ul className="flex space-x-8">
            <li>
              <Link className="text-lg text-gray-800 hover:text-blue-600 transition-colors" to="/tasks">Tasks</Link>
            </li>
            <li>
              <Link className="text-lg text-gray-800 hover:text-blue-600 transition-colors" to="/employees">Employees</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
