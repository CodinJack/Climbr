// src/components/Search.js
import React from 'react';

const Search = ({ searchQuery, setSearchQuery }) => {
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleInputChange}
      className="text-black w-full px-3 py-2 border rounded-lg"
    />
  );
};

export default Search;
