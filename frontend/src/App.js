import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeList from './pages/EmployeeList';
import TaskDetail from './pages/TaskDetail';
import TasksList from './pages/TasksList';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';

function App() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await fetch('https://climbr.onrender.com/tasks', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const fetchEmployees = async () => {
        try {
          const response = await fetch('https://climbr.onrender.com/employees', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching the employees:', error);
        }
      };
      fetchEmployees();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="App container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={token ? <TasksList /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={token ? <TaskDetail tasks={tasks} employees={employees} /> : <Navigate to="/login" />} />
          <Route path="/employees" element={token ? <EmployeeList /> : <Navigate to="/login" />} />
          <Route path="/employees/:id" element={token ? <EmployeeDetail /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={token ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token? <ManagerProfile /> : <Navigate to="/login"/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
