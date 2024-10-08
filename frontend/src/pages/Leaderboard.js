import React, { useEffect, useState } from 'react';
import Navbar from '../components/Nav';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Loading from '../components/Loading';

export default function Leaderboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const fetchEmployees = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_LINK + '/employees', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        const sortedEmployees = data.sort((a, b) => b.totalPoints - a.totalPoints);
        const filteredEmployees = sortedEmployees.filter(
          (employee) => employee.role === 'employee'
        );

        setEmployees(filteredEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-12 px-6 min-h-screen text-white bg-gray-900">
      <Navbar />
      <div className="mt-12">
        <h2 className="text-white text-3xl font-bold text-center">Leaderboard</h2>
        <div className="mt-6 space-y-4">
          {employees.map((employee, index) => {
            let bgColor;
            if (index === 0) bgColor = 'bg-yellow-500';
            else if (index === 1) bgColor = 'bg-gray-400';
            else if (index === 2) bgColor = 'bg-yellow-800';
            else bgColor = 'bg-gray-800';

            return (
              <div
                key={employee._id}
                className={`${bgColor} p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105`}
                data-aos="fade-up"
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
