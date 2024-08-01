import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeList from './pages/EmployeeList';
import TaskDetail from './pages/TaskDetail';
import TasksList from './pages/TasksList';
import Leaderboard from './pages/Leaderboard';

function App() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  //fetching the tasks from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }; 
    fetchData();
  }, []);

  //fetching the employeed from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching the employees: ', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <BrowserRouter>
      <div className="App container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
        <Routes>
          <Route path="/" element={<TasksList />} />
          <Route path="/tasks/:id" element={<TaskDetail tasks={tasks} employees={employees} />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
