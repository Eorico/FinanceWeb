import React from 'react';
import '../ui/styles/dashboard.css'

import Topbar from '../ui/Topbar';
import OverviewCards from '../ui/OverviewCards';
import TransactionTable from '../ui/TransactionTable';
import BudgetTracker from '../ui/BudgetTracker';
import Footer from '../ui/Footer';

function Dashboard() {
  const token = localStorage.getItem('token');
  console.log('Dashboard loaded. Token exists?', !!token);

  if (!token) {
    return (
      <div className="auth-container">
        <h2>Unauthorized</h2>
        <p>You must be logged in to view this page.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }
  
  // Only render dashboard content, not layout/sidebar
  return (
    <>
      <Topbar title="Welcome Back!"/>
      <OverviewCards/>
      <TransactionTable/>
      <BudgetTracker/>
      <Footer/>
    </>
  );
}

export default Dashboard;