import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav';
import Task from '../components/Task'; 

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState();
  const [taskIDs, setTaskIDs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_LINK + `/employees/${id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setEmployee(data);
        if (data.tasks) {
          setTaskIDs(data.tasks);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_LINK + '/tasks', {
          credentials: 'include'
        });
        const data = await response.json();
        const assignedTasks = data.filter(task => taskIDs.includes(task._id));
        
        assignedTasks.sort((a, b) => (a.completed === b.completed ? 0 : (a.completed ? 1 : -1)));
        setTasks(assignedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    if (taskIDs.length > 0) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [taskIDs]);

  const handleRemoveEmployee = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_LINK + `/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        console.log('Employee removed successfully');
        navigate('/employees'); 
      } else {
        throw new Error('Failed to remove employee');
      }
    } catch (error) {
      console.error('Error removing employee:', error);
      setError('Failed to remove employee');
    }
  };

  const calculateTaskCompletionRate = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  if (!employee) {
    return <div className="text-white">Employee not found</div>;
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
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
        <p>Task Completion Rate: {calculateTaskCompletionRate()}%</p>
        <div className="text-2xl font-semibold text-purple-400 mb-4">TaskIDs Assigned:</div>
        <div className="space-y-4">
          {tasks.length === 0 && <p className="text-white">No taskIDs assigned to this employee.</p>}
          {tasks.map(task => (
            <Task key={task._id} assignedTo={employee._id} name={employee.name} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
