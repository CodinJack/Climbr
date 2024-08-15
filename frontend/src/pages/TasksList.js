import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/Nav';
import Task from '../components/Task';
import Modal from '../components/TaskModal';
import Search from '../components/Search';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import 'aos/dist/aos.css';

export default function TasksList({ tasks: initialTasks, employees: initialEmployees }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [employees, setEmployees] = useState(initialEmployees);
  const [empID, setEmpID] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: '',
  });
  const [assignToOption, setAssignToOption] = useState('single');
  const [searchQuery, setSearchQuery] = useState('');

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

    console.log('Cookies:', cookies); // Log all cookies
    console.log('Token:', cookies.token); // Log specific token

    const decodeToken = () => {
      if (cookies.token) {
        try {
          const decodedToken = jwtDecode(cookies.token);
          const userId = decodedToken.id;

          console.log('Decoded Token:', decodedToken);
          console.log('User ID:', userId);

          const user = employees.find(emp => emp._id === userId);
          if (user) {
            const isManagerRole = user.role === 'manager';
            setIsManager(isManagerRole);
            console.log('Is user a manager?', isManagerRole);
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        console.log("No token found in cookies");
      }
    };

    decodeToken();
  }, [employees, cookies.token]);


  // Use useMemo to sort tasks only when tasks change
  const sortedTasks = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const nonCompletedTasks = tasks.filter(task => !task.completed);
    nonCompletedTasks.sort((a, b) => b.points - a.points);
    return [...nonCompletedTasks, ...completedTasks];
  }, [tasks]);

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
      let assignedToList = [];
      if (assignToOption === 'all') {
        assignedToList = employees.map(emp => emp._id);
      } else {
        const employee = employees.find(emp => emp.employeeID === empID);
        assignedToList = employee ? [employee._id] : [];
      }

      const tasksToCreate = assignedToList.map(empID => ({
        ...newTask,
        assignedTo: empID,
      }));

      const createdTasks = await Promise.all(tasksToCreate.map(async task => {
        const response = await fetch(process.env.REACT_APP_BACKEND_LINK + '/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Error creating task');
        }
        return response.json();
      }));

      setTasks(prevTasks => [...prevTasks, ...createdTasks]);
      setNewTask({ title: '', description: '', dueDate: '', points: '', assignedTo: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setModalOpen(false);
    }
  };

  const filteredTasks = sortedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
      <Navbar />
      <div className="container-fluid mx-auto py-12 px-6">
        <div className="grid grid-cols-3 gap-4 top-16 py-6 z-0">
          <h1 className="col-span-1 text-white text-3xl font-bold">Tasks</h1>
          <div className="col-span-1">
            <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          {isManager && (
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => setModalOpen(true)}
                className='bg-purple-500 text-white font-medium text-xl px-3 py-2 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105'
              >
                Create a task
              </button>
            </div>
          )}
        </div>
        <div className="space-y-4 pt-2">
          {filteredTasks.map((task) => (
            <Task
              data-aos="fade-up"
              key={task._id}
              name={getEmployeeName(task.assignedTo)}
              assignedTo={getEmployeeID(task.assignedTo)}
              task={task}
            />
          ))}
        </div>
      </div>
      {/*"add a task" modal*/}
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
            <select
              name="assignToOption"
              value={assignToOption}
              onChange={(e) => setAssignToOption(e.target.value)}
              className="w-full text-black px-3 py-2 border rounded-lg"
            >
              <option value="single">Assign to one</option>
              <option value="all">Assign to all</option>
            </select>
          </div>
          {assignToOption === 'single' && (
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Employee ID</label>
              <input
                type="text"
                name="assignedTo"
                value={empID}
                onChange={handleInputChange}
                className="w-full text-black px-3 py-2 border rounded-lg"
              />
            </div>
          )}
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
