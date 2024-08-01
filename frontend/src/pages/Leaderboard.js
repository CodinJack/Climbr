import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Leaderboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  const leaderboard = employees.map(emp => {
    const employeeTasks = tasks.filter(task => task.assignedTo === emp._id && task.completed);
    const totalPoints = employeeTasks.reduce((sum, task) => sum + task.points, 0);
    return { ...emp, totalPoints };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white">
      <Navbar />
      <div className="mt-12">
        <h2 className="text-white text-3xl font-bold text-center">Leaderboard</h2>
        <div className="mt-6 space-y-4">
          {leaderboard.map((employee, index) => {
            let bgColor;
            if (index === 0) bgColor = 'bg-yellow-500';
            else if (index === 1) bgColor = 'bg-gray-400';
            else if (index === 2) bgColor = 'bg-yellow-800';
            else bgColor = 'bg-gray-800';

            return (
              <div
                key={employee._id}
                className={`${bgColor} p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {index + 1}. {employee.name}
                  </span>
                  <span className="text-xl font-bold">
                    {employee.totalPoints} points
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
