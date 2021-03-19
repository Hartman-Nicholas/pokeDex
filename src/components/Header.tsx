import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center p-6 bg-white rounded-lg">
      <div className="ml-6 pt-1">
        <h1 className="text-2xl text-blue-700 leading-tight">SDA-9 PokeDex</h1>
        <p className="text-base text-gray-700 leading-normal">Gotta Catch 'Em All!</p>
      </div>
    </div>
  );
};

export default Header;
