import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Loading from '../components/Loading'; // Import the Loading component

export default function Login() {
    const [employeeID, setEmployeeID] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [newManager, setNewManager] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading
        setError(''); // Clear previous errors

        // Set a timeout to check if loading takes too long
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError('The request took too long. Please try again.');
            navigate('/login');
        }, 10000); // 10 seconds

        try {
            let response;
            if (newManager) {
                response = await fetch('https://climbr.onrender.com/auth/signup-manager', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ employeeID, name, password }),
                });
            } else {
                response = await fetch('https://climbr.onrender.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ employeeID, password, role }),
                });
            }

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                clearTimeout(timeoutId);
                navigate('/tasks');
            } else {
                clearTimeout(timeoutId);
                console.error('Error response from server:', data.message);
                setError(data.message);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Error logging in:', error);
            setError('Server error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <Logo />
                <h2 className="text-2xl font-bold text-center text-white">Sign in to your account</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            setRole('employee');
                            setNewManager(false);
                        }}
                        className={`w-1/2 px-4 py-2 font-bold text-center rounded-lg focus:outline-none 
                                ${role === 'employee' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                        Employee
                    </button>
                    <button
                        onClick={() => {
                            setRole('manager');
                            setNewManager(false);
                        }}
                        className={`w-1/2 px-4 py-2 font-bold text-center rounded-lg focus:outline-none 
                                ${role === 'manager' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                        Manager
                    </button>
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {newManager && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-black rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="employeeID" className="block text-sm font-medium text-gray-300">
                            Employee ID
                        </label>
                        <input
                            id="employeeID"
                            name="employeeID"
                            type="text"
                            required
                            value={employeeID}
                            onChange={(e) => setEmployeeID(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-black rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-black rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            {newManager && role === "manager" ? 'Create Manager' : 'Sign In'}
                        </button>
                    </div>
                    <div>
                        {role === "manager" && (
                            <button
                                type="button"
                                onClick={() => setNewManager(true)}
                                className="w-full text-center text-sm font-small text-purple-500 hover:text-purple-700"
                            >
                                New Manager?
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
