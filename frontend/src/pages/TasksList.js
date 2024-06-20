// src/pages/TasksList.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import Task from '../components/Task';
import Modal from '../components/TaskModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function TasksList() {
  const [empID, setEmpID] = useState('');
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: '',
  });

  const getEmployeeID = (taskId) => {
    const employee = employees.find((emp) => emp._id === taskId);
    return employee ? employee.employeeID : 'Unknown';
  };

  const getEmployeeName = (taskId) => {
    const employee = employees.find((emp) => emp._id === taskId);
    return employee ? employee.name : 'Unknown';
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        data.sort((a, b) => (a.completed === b.completed ? 0 : (a.completed ? 1 : -1)));
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'assignedTo') {
      setEmpID(value);
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const handleCreateTask = async () => {
    try {
      const employee = employees.find(emp => emp.employeeID === empID);
      if (employee) {
        newTask.assignedTo = employee._id;
      } else {
        newTask.assignedTo = '';
      }

      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      
      if (!response.ok) {
        throw new Error('Error creating task');
      }
      
      const data = await response.json();
      console.log('Task created successfully:', data);

      const tasksResponse = await fetch('http://localhost:5000/tasks');
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
      setNewTask({ title: '', description: '', dueDate: '', points: '', assignedTo: '' });
      window.location.reload();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setModalOpen(false); 
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white">
      <Navbar />
      <div className="container-fluid mx-auto py-12 px-6">
        <div className="sticky top-16 py-6 z-0 flex justify-between">
          <h1 className="text-white text-3xl font-bold">Tasks</h1>
          <button
            onClick={() => setModalOpen(true)}
            className='bg-purple-500 text-white font-medium text-xl px-3 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105'
          >
            Create a task
          </button>
        </div>
        <div className="space-y-4 pt-2">
          {tasks.map((task) => (
            <Task 
              data-aos="fade-up" 
              key={task.id}
              name={getEmployeeName(task.assignedTo)} 
              assignedTo={getEmployeeID(task.assignedTo)} 
              task={task}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Points</label>
            <input
              type="number"
              name="points"
              value={newTask.points}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Assign To</label>
            <input
              type="text"
              name="assignedTo"
              value={empID}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCreateTask}
              className="bg-purple-500 text-white font-medium text-xl px-6 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
