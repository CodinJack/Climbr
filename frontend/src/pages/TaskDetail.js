import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';

export default function TaskDetail({ tasks, employees }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const task = tasks.find(task => task._id === id);
  const employee = employees.find(emp => emp._id === task.assignedTo);
  const [errorMessage, setErrorMessage] = useState('');

  if (!task) {
    return <div className="text-white">Task not found</div>;
  }

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCompleteTask = async () => {
    try {
      if (!task.completed) {
        task.completed = true;
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        });
        if (!response.ok) {
          throw new Error('Failed to complete task');
        }
        navigate('/');
      }
      else {
        setErrorMessage("Task already completed!");
      }
    } catch (error) {
      setErrorMessage("Error completing task!");
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      // Optionally, you can handle state update or display a success message
      // Reload tasks or update local state
      navigate('/');
    } catch (error) {
      setErrorMessage("Error deleting task!");
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
      <Navbar />
      <div className="">
        <button
          onClick={() => navigate('/')}
          className="mt-16 ml-6 bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back
        </button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-0 w-full">
        {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className='justify-between flex items-center mb-6'>
            <h2 className="text-4xl font-bold text-purple-400">{task.title}</h2>
            <p className='text-gray-500'>
              {task.completed ? 'Completed' : 'Not completed'}
            </p>
          </div>

          <p className="text-lg text-gray-300 mb-6">{task.description}</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Due date:</span>
              <span className="text-white">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Points:</span>
              <span className="text-white">{task.points}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Assigned to:</span>
              <span className="text-white">{employee.name} ({employee.employeeID})</span>
            </div>
          </div>

          <div className="mt-8 justify-center flex space-x-4">
            <button
              onClick={handleCompleteTask}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Task Completed
            </button>
            <button
              onClick={handleDeleteTask}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
