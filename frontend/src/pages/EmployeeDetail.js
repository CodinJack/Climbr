// src/pages/EmployeeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import Task from '../components/Task'; // Assuming Task component is defined

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/employees/${id}?_embed=tasks`);
        const data = await response.json();
        setEmployee(data);
        if (data.tasks) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleRemoveEmployee = async () => {
    try {
      const response = await fetch(`http://localhost:5000/employees/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Employee removed successfully');
        navigate('/employees'); // Navigate back to employee list using useNavigate
      } else {
        throw new Error('Failed to remove employee');
      }
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  if (!employee) {
    return <div className="text-white">Employee not found</div>;
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white">
      <Navbar />
      <button
        onClick={() => navigate('/employees')}
        className="mt-12 bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Back
      </button>
      <div className="bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl mx-auto mt-0">
        <div className='flex justify-between'>
        <h2 className="text-4xl font-bold text-purple-400 mb-6">{employee.name}</h2>
        <button
            onClick={handleRemoveEmployee}
            className="px-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Remove Employee
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">Employee ID: {employee.employeeID}</p>
        <div className="flex items-center justify-between mb-8">

          
        </div>

        <div className="text-2xl font-semibold text-purple-400 mb-4">Tasks Assigned:</div>
        <div className="space-y-4">
          {tasks.length === 0 && <p className="text-white">No tasks assigned to this employee.</p>}
          {tasks.length !== 0 && tasks.map(task => (
            <Task key={task._id} assignedTo={employee.name} name={employee.name} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
