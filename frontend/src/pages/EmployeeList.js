import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Nav';
import Modal from '../components/TaskModal';
import Search from '../components/Search';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeID: '',
    password: '',
    tasks:[],
    totalPoints: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    console.log('Attempting to add employee:', newEmployee);
    try {
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
  
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(responseText || 'Error adding employee');
      }
  
      const data = JSON.parse(responseText);
      console.log('Employee added successfully:', data);
  
      setEmployees([...employees, data]);
      setNewEmployee({ name: '', employeeID: '', password: '', tasks: [], totalPoints: 0 });
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
      <Navbar />
      <div className="container-fluid mx-auto py-12 px-6">
        <div className="grid grid-cols-3 gap-4 top-16 py-6 z-0">
          <h1 className="col-span-1 text-white text-3xl font-bold">Employees</h1>
          <div className="col-span-1">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="col-span-1 flex justify-end space-x-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-purple-500 text-white font-medium text-xl px-3 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add an employee
            </button>
            <Link to="/leaderboard">
              <button
                className="bg-blue-500 text-white font-medium text-xl px-3 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                View Leaderboard
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center">
          {filteredEmployees.map((employee) => (
            <Link data-aos="fade-up" to={`/employees/${employee._id}`} key={employee._id}>
              <div className="bg-gray-800 p-10 rounded-lg shadow-md mx-4 my-4 max-w-sm text-center">
                <h3 className="text-2xl font-semibold text-purple-400">{employee.name}</h3>
                <p className="text-gray-300">Username: {employee.employeeID}</p>
                <p className="text-gray-300">Total Points: {employee.totalPoints}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              className="text-black w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username (Employee ID)</label>
            <input
              type="text"
              name="employeeID"
              value={newEmployee.employeeID}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg mb-2"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg mb-2"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddEmployee}
              className="bg-purple-500 text-white font-medium text-xl px-6 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
