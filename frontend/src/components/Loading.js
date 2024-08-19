import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-purple-400 border-opacity-75"></div>
    </div>
  );
};

export default Loading;
