import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';  // Removed the named import as jwtDecode is a default export
import NavBar from '../components/Nav';
import Task from '../components/Task';
import Loading from '../components/Loading';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [manager, setManager] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const employeeID = decodedToken.id;

          const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees/${employeeID}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);

            const taskDetailsPromises = data.tasks.map(async (taskId) => {
              const taskResponse = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks/${taskId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (taskResponse.ok) {
                return await taskResponse.json();
              } else {
                console.error('Failed to fetch task details for task ID:', taskId);
                return null;
              }
            });

            const taskDetails = await Promise.all(taskDetailsPromises);
            setTasks(taskDetails.filter(task => task !== null)); // Filter out null values if any fetch failed

            if (data.manager) {
              const managerResponse = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees/${data.manager}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (managerResponse.ok) {
                const managerData = await managerResponse.json();
                setManager(managerData);
              } else {
                console.error('Failed to fetch manager data');
              }
            }
          } else {
            console.error('Failed to fetch user data');
          }
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTasks();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-white text-xl">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <NavBar />
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-3xl w-full text-white">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Employee ID:</span>
                <span className="font-medium">{user.employeeID}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Joined on:</span>
                <span className="font-medium">{new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Total Points:</span>
                <span className="font-medium">{user.totalPoints}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500">Manager:</span>
                <span className="font-medium">{manager ? `${manager.name} (${manager.employeeID})` : 'N/A'}</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Tasks:</h2>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-400">No tasks assigned</p>
              ) : (
                tasks.map((task) => (
                  <Task
                    key={task._id}
                    assignedTo={user.employeeID}
                    name={user.name}
                    task={task}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
