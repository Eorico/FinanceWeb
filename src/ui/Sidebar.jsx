import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  PiggyBank,
  CreditCard, 
  Settings, 
  CheckSquare, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  TrendingUp
} from 'lucide-react';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  let user = { name: '', email: '' };

  try {
    user = JSON.parse(localStorage.getItem('user')) || { name: '', email: ''};
  } catch {
    user = { name: '', email: '' }
  }

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/budgetracker', label: 'Budget', icon: PiggyBank },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/todolist', label: 'To-Do List', icon: CheckSquare },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <DollarSign size={24} />
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <h2>FinancePro</h2>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn" 
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="nav-icon" />
                  {!isCollapsed && <span className="nav-text">{item.label}</span>}
                  {isActive && <div className="active-indicator" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span> 
            </div>
          </div>
        )}
        
        <button
          className="logout-btn"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;