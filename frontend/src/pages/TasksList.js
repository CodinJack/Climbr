import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import Task from '../components/Task';
import Modal from '../components/TaskModal';
import Search from '../components/Search';
import AOS from 'aos';
import {jwtDecode} from 'jwt-decode'; // Make sure you import jwtDecode correctly
import 'aos/dist/aos.css';
import Loading from '../components/Loading';

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
  const [isLoading, setIsLoading] = useState(true);

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

        if (!tasksResponse.ok || !employeesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const tasksData = await tasksResponse.json();
        const employeesData = await employeesResponse.json();

        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          console.error('Tasks data is not an array:', tasksData);
          setTasks([]);
        }

        setEmployees(employeesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setTasks([]);
        setIsLoading(false);
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
          if (!response.ok) {
            throw new Error('Failed to create task');
          }
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

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
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
                className="bg-purple-500 text-white font-medium text-xl px-3 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Create a Task
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold text-purple-500 "><Loading/></h2>
          </div>
        ) : (
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
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">Create New Task</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-gray-500 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-gray-500 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-gray-500 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Points</label>
            <input
              type="number"
              name="points"
              value={newTask.points}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border text-gray-500 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Assign To</label>
            {filteredEmployees.length > 0 ? (
              <div>
                {filteredEmployees.map((emp) => (
                  <div key={emp._id} className="mb-2">
                    <input
                      type="checkbox"
                      value={emp._id}
                      checked={selectedEmployees.includes(emp._id)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label className="text-gray-700">{emp.name} ({emp.employeeID})</label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No employees available.</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleCreateTask}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
