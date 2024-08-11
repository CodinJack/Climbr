import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center justify-center mb-8">
      <h1 className="text-4xl font-bold text-purple-500 ml-4">Climbr.</h1>
    </Link>
  );
}
