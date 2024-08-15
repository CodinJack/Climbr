import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function NavBar() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">Climbr</Link>
        </div>
        <div className="space-x-4">
          <Link to="/tasks" className="text-white hover:text-gray-400">Tasks</Link>
          <Link to="/employees" className="text-white hover:text-gray-400">Employees</Link>
          <Link to="/leaderboard" className="text-white hover:text-gray-400">Leaderboard</Link>
          <Link to="/profile" className="text-white hover:text-gray-400">Profile</Link>
          <button 
            onClick={handleLogout} 
            className="text-white hover:text-gray-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
