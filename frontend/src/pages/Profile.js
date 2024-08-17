import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const employeeID = decodedToken.id;
          const response = await fetch(`${process.env.BACKEND_LINK}/employees/${employeeID}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUser(data);
          } else {
            console.error('Failed to fetch user data');
          }
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="flex justify-center items-center h-screen text-white text-xl">Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full text-white">
        <div className="flex items-center space-x-4">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-purple-500"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-purple-400">{user.email}</p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Username:</span>
            <span>{user.username}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Role:</span>
            <span>{user.role}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Joined on:</span>
            <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
