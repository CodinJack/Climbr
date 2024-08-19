import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Logo from './Logo';

function NavBar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Assuming the role is stored in the token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-gray-900 p-0 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-extrabold text-2xl">
          <Logo />
        </div>
        <div className="space-x-6 flex items-center">
          <Link
            to="/tasks"
            className="text-white font-medium text-lg hover:text-purple-500 transition duration-300 ease-in-out transform hover:scale-110"
          >
            Tasks
          </Link>
          {role === 'manager' && (
            <Link
              to="/employees"
              className="text-white font-medium text-lg hover:text-purple-500 transition duration-300 ease-in-out transform hover:scale-110"
            >
              Employees
            </Link>
          )}
          <Link
            to="/leaderboard"
            className="text-white font-medium text-lg hover:text-purple-500 transition duration-300 ease-in-out transform hover:scale-110"
          >
            Leaderboard
          </Link>
          <Link
            to="/profile"
            className="text-white font-medium text-lg hover:text-purple-500 transition duration-300 ease-in-out transform hover:scale-110"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-white font-medium text-lg hover:text-purple-500 transition duration-300 ease-in-out transform hover:scale-110"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
