import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 fixed-top shadow w-full z-10">
      <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
        <div>
          <Link className="text-3xl ml-8 font-bold text-purple-400" to="/">Climbr.</Link>
        </div>
        <div className="hidden md:block text-center">
          <h1 className='text-xl font-semibold text-gray-300'>Task Manager</h1>
        </div>
        <div className="col-span-2 md:col-span-1 flex justify-end">
          <ul className="flex space-x-12">
            <li>
              <Link className="text-lg font-semibold text-gray-300 hover:text-purple-200 transition-colors" to="/">Tasks</Link>
            </li>
            <li>
              <Link className="text-lg font-semibold text-gray-300 hover:text-purple-200 transition-colors" to="/employees">Employees</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
