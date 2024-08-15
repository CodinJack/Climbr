import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeList from './pages/EmployeeList';
import TaskDetail from './pages/TaskDetail';
import TasksList from './pages/TasksList';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(!!Cookies.get('token'));

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/tasks`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          } else {
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      fetchData();
  }, []);

  useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_LINK}/employees`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setEmployees(data);
          } else {
            console.error('Failed to fetch employees');
          }
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };

      if (employees.length === 0) {
        fetchEmployees();
      }
  }, [employees]);

  return (
    <BrowserRouter>
      <div className="App container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/tasks" element={token ? <TasksList tasks={tasks} employees={employees} /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={token ? <TaskDetail tasks={tasks} employees={employees} /> : <Navigate to="/login" />} />
          <Route path="/employees" element={token ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/employees/:id" element={token ? <EmployeeDetail /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={token ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;