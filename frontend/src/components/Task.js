import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Task({ task, name, assignedTo, ...props }) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tasks/${task._id}`);
  };

  return (
    <div 
      className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out"
      onClick={handleClick}
      {...props}
    >
      <div className="flex justify-between items-center">
      <h3 className={`text-2xl font-semibold ${task.completed ? 'text-green-500' : 'text-purple-400'}`}>{task.title} <span className='text-lg'>({task.points} points)</span></h3>
        <p className="text-gray-500">Due date: <span className='text-white'>{formattedDate}</span></p>
      </div>
      <p className="text-gray-300">
        Assigned to: <span className="font-bold text-white">{name}</span> 
        <span className="text-gray-500"> ({assignedTo})</span>
      </p>
    </div>
  );
}
