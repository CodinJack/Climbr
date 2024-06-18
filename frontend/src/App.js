import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeDetail from "./pages/EmployeeDetail"
import EmployeeList from './pages/EmployeeList';
import TaskDetail from './pages/TaskDetail';
import TasksList from './pages/TasksList';

function App() {
  return (
    <BrowserRouter>
      <div className="App container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
        <Routes>
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


export default App;
