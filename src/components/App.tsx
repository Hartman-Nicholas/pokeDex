import React from 'react';
import Header from './Header';
import PokeDex from './PokeDex';

const App: React.FC = () => {
  return (
    <div className="bg-gray-200 min-h-screen pt-4 px-8 antialiased text-gray-900">
      <div>
        <Header />
        <PokeDex />
      </div>
    </div>
  );
};

export default App;
