import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeList from './pages/EmployeeList';
import TaskDetail from './pages/TaskDetail';
import TasksList from './pages/TasksList';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [token, setToken] = useState(() => !!localStorage.getItem('token'));
  return (
    <BrowserRouter>
      <div className="App container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={token ? <TasksList /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={token ? <TaskDetail /> : <Navigate to="/login" />} />
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