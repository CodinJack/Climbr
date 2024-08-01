import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [employeeID, setEmployeeID] = useState('');
  const [password, setPassword] = useState('');
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeID, password, isManager })
      });
      if (response.ok) {
        const data = await response.json();
        Cookies.set('authToken', data.token);
        Cookies.set('isManager', isManager);
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-center">
        <h1 className="text-3xl font-bold text-purple-400">Climbr.</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsManager(false)}
            className={`w-full py-2 rounded-l ${!isManager ? 'bg-purple-600' : 'bg-gray-700'} text-white`}
          >
            Login as Employee
          </button>
          <button
            type="button"
            onClick={() => setIsManager(true)}
            className={`w-full py-2 rounded-r ${isManager ? 'bg-purple-600' : 'bg-gray-700'} text-white`}
          >
            Login as Manager
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="employeeID">
            Username (Employee ID)
          </label>
          <input
            type="text"
            id="employeeID"
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition duration-300 ease-in-out">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
