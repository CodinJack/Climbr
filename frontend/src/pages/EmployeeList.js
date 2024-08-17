import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Nav';
import Modal from '../components/EmployeeModal';
import Search from '../components/Search';
import AOS from 'aos';
import {jwtDecode} from 'jwt-decode';
import bcrypt from 'bcryptjs'; 
import 'aos/dist/aos.css';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeID: '',
    password: '',
    tasks: [],
    totalPoints: 0,
    role: "employee",
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode(token);
      const managerID = decodedToken.id;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized error, maybe redirect to login
          console.error('Unauthorized access - redirecting to login');
          // Add redirection or other handling here
          return;
        }
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      const filteredEmployees = data.filter(
        (employee) => employee.manager === managerID && employee.role === 'employee'
      );

      setEmployees(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode(token);
      const managerID = decodedToken.id;

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newEmployee.password, salt);

      const employeeToAdd = { 
        ...newEmployee, 
        manager: managerID,
        password: hashedPassword,
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employeeToAdd),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error adding employee');
      }

      const data = await response.json();
      console.log('Employee added successfully:', data);

      setEmployees([...employees, data]);
      setNewEmployee({ name: '', employeeID: '', password: '', tasks: [], totalPoints: 0, role: "employee" });
      setModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortCriteria] < b[sortCriteria]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortCriteria] > b[sortCriteria]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(employee =>
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
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button onClick={() => handleSort('name')} className="mx-2 px-3 py-1 bg-gray-700 rounded">
            Sort by Name {sortCriteria === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort('totalPoints')} className="mx-2 px-3 py-1 bg-gray-700 rounded">
            Sort by Points {sortCriteria === 'totalPoints' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        <div className="flex flex-wrap justify-center">
          {filteredEmployees.length ? (
            filteredEmployees.map((employee) => (
              <Link data-aos="fade-up" to={`/employees/${employee._id}`} key={employee._id}>
                <div className="bg-gray-800 p-10 rounded-lg shadow-md mx-4 my-4 max-w-sm text-center">
                  <h3 className="text-2xl font-semibold text-purple-400">{employee.name}</h3>
                  <p className="text-gray-300">Username: {employee.employeeID}</p>
                  <p className="text-gray-300">Total Points: {employee.totalPoints}</p>
                </div>
              </Link>
            ))
          ) : (
            <div data-aos="fade-up" className="text-center py-10">
              <h2 className="text-2xl font-semibold text-purple-500">No employees found</h2>
              <p className="text-gray-400">It seems like there are no employees under you currently.</p>
            </div>
          )}
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
              className="w-full text-black px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              className="w-full text-black px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="button"
            onClick={handleAddEmployee}
            className="bg-purple-500 text-white font-medium text-xl px-3 py-2 mt-4 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Employee
          </button>
        </form>
      </Modal>
    </div>
  );
}
