
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>FinancePro</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard">Overview</Link></li>
          <li><Link to="/budgetracker">Budget</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/todolist">To-Do List</Link></li>
        </ul>
      </nav>

      <div className="logout-section">
        <button
          className="logout-btn-sidebar"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
