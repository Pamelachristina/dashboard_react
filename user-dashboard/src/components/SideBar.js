import React from 'react';

const SideBar = () => {
  return (
    <div className="sideBar">
      <div className="p-4">
        <img src="https://placehold.co/150x50/png?text=MOLECULAR+FOUNDRY" alt="Molecular Foundry logo" className="mb-4" />
        <div className="relative">
          <input type="text" placeholder="Search ..." className="w-full pl-8 pr-2 py-1 " />
          <i className="fas fa-search absolute left-2 top-2 text-gray-400"></i>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User Office Dashboard</h2>
        <ul>
          <li className="mb-2"><i className="fas fa-chart-pie mr-2"></i> Overview</li>
          <li className="mb-2"><i className="fas fa-users mr-2"></i> User Stats</li>
          <li className="mb-2"><i className="fas fa-chart-bar mr-2"></i> Charts</li>
          <li className="mb-2"><i className="fas fa-table mr-2"></i> Tables</li>
          <li className="mb-2"><i className="fas fa-cog mr-2"></i> Settings</li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;

