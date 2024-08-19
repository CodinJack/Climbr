import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import 'aos/dist/aos.css';
import Loading from '../components/Loading';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodeToken = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setIsManager(decodedToken.role === 'manager');
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error fetching or decoding token:', error);
      }
    };

    const fetchTask = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const taskData = await response.json();
        setTask(taskData);

        const employeeResponse = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees/${taskData.assignedTo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!employeeResponse.ok) {
          throw new Error('Failed to fetch employee');
        }

        const employeeData = await employeeResponse.json();
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching task or employee details:', error);
      } finally {
        setLoading(false);
      }
    };

    decodeToken();
    fetchTask();
  }, [id]);

  const handleTaskCompletion = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!task || !employee) {
    return <div className="text-center text-white">Task or Employee not found</div>;
  }

  return (
    <div className="container py-12 px-6 bg-gray-900 text-white">
      <Navbar />
      <button
        onClick={() => navigate('/tasks')}
        className="mt-12 bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Back
      </button>
      <div className="bg-gray-800 p-10 rounded-lg shadow-md mt-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">{task.title}</h1>
        <p className="text-gray-300 mb-4">{task.description}</p>
        <p className="text-gray-500 mb-4">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
        <p className="text-gray-500 mb-4">Points: {task.points}</p>
        <p className="text-gray-500 mb-4">Assigned To: {employee.name} ({employee.employeeID})</p>

        <div className="flex justify-between items-center mt-6">
          {isManager && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleTaskCompletion()}
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md"
              >
                Mark as Completed
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
