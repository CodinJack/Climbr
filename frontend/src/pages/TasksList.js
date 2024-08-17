import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import Task from '../components/Task';
import Modal from '../components/TaskModal';
import Search from '../components/Search';
import AOS from 'aos';
import { jwtDecode } from 'jwt-decode';
import 'aos/dist/aos.css';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [currentUserID, setCurrentUserID] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

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
      once: true,
    });

    const decodeToken = () => {
      try {
        const token = localStorage.getItem('token');

        if (token) {
          const decodedToken = jwtDecode(token);
          const isManagerRole = decodedToken.role === 'manager';
          setIsManager(isManagerRole);
          setCurrentUserID(decodedToken.id);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error fetching or decoding token:', error);
      }
    };

    decodeToken();

    const fetchInitialData = async () => {
      try {
        const [tasksResponse, employeesResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        const tasksData = await tasksResponse.json();
        const employeesData = await employeesResponse.json();

        // Ensure tasksData is an array before setting it
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          console.error('Tasks data is not an array:', tasksData);
          setTasks([]); // Default to an empty array if the data is not valid
        }

        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setTasks([]); // Default to an empty array on error
      }
    };

    fetchInitialData();
  }, []);

  const insertTaskInOrder = (newTask, taskList) => {
    const newTaskPoints = newTask.points;
    const index = taskList.findIndex(
      (task) => task.points < newTaskPoints && !task.completed
    );

    if (index === -1) {
      return [...taskList, newTask];
    }

    return [
      ...taskList.slice(0, index),
      newTask,
      ...taskList.slice(index),
    ];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedEmployees((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value)
    );
  };
  const handleCreateTask = async () => {
    try {
      const employeesToAssign = selectedEmployees.length > 0 ? selectedEmployees : [newTask.assignedTo];

      const createdTasks = await Promise.all(
        employeesToAssign.map(async (empID) => {
          const taskData = { ...newTask, assignedTo: empID };
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_LINK}/tasks`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(taskData),
            }
          );
          return response.json();
        })
      );

      setTasks((prevTasks) => {
        let updatedTasks = prevTasks;
        createdTasks.forEach((newTask) => {
          updatedTasks = insertTaskInOrder(newTask, updatedTasks);
        });
        return updatedTasks;
      });

      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        points: '',
        assignedTo: '',
      });
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setModalOpen(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) => employee.manager === currentUserID
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (isManager) {
      const assignedEmployee = employees.find(
        (emp) => emp._id === task.assignedTo
      );
      return (
        matchesSearch &&
        assignedEmployee &&
        assignedEmployee.role === 'employee' &&
        assignedEmployee.manager === currentUserID
      );
    } else {
      return matchesSearch && task.assignedTo === currentUserID;
    }
  });

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
      <Navbar />
      <div className="container-fluid mx-auto py-12 px-6">
        <div className="grid grid-cols-3 gap-4 top-16 py-6 z-0">
          <h1 className="col-span-1 text-white text-3xl font-bold">
            Tasks
          </h1>
          <div className="col-span-1">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          {isManager && (
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-xl px-6 py-1 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Create a Task
              </button>
            </div>
          )}
        </div>
        <div className="space-y-6 pt-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Task
                data-aos="fade-up"
                key={task._id}
                name={getEmployeeName(task.assignedTo)}
                assignedTo={getEmployeeID(task.assignedTo)}
                task={task}
              />
            ))
          ) : (
            <div
              data-aos="fade-up"
              className="text-center py-8 "
            >
              <h2 className="text-3xl font-semibold text-purple-500">
                No tasks found
              </h2>
              <p className="text-gray-400">
                It seems like there are no tasks assigned at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form className="bg-white rounded-lg p-6">
          <div className="mb-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Points
            </label>
            <input
              type="number"
              name="points"
              value={newTask.points}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assign To
            </label>
            <div className="grid grid-cols-2 gap-4">
              {filteredEmployees.map((employee) => (
                <label
                  key={employee._id}
                  className="flex items-center p-2 border rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
                      hover:bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500"
                >
                  <input
                    type="checkbox"
                    name="assignTo"
                    value={employee._id}
                    checked={selectedEmployees.includes(employee._id)}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">
                    {employee.employeeID} - {employee.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 text-black">
              <h1 className="text-lg font-semibold">Selected Employees:</h1>
              <ul className="mt-2 list-disc pl-5">
                {selectedEmployees.length === 0 ? (
                  <li>None</li>
                ) : (
                  selectedEmployees.map((id) => (
                    <li key={id}>
                      {employees.find((emp) => emp._id === id)?.name || 'Unknown'}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateTask}
              className="bg-purple-600 text-white font-medium text-lg px-6 py-1 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
