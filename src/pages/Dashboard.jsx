import React from 'react';
import { FinancialProvider } from '../components/context/FinancialContext';
import '../ui/styles/dashboard.css'

import OverviewCards from './navlinksPages/OverviewCards';
import TransactionTable from './navlinksPages/TransactionTable';
import BudgetTracker from './navlinksPages/BudgetTracker';
import Analytics from './navlinksPages/Analytics';
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
    <FinancialProvider>
      <OverviewCards/>
      <Analytics/>
      <TransactionTable/>
      <BudgetTracker/>
      <Footer/>
    </FinancialProvider>
  );
}

export default Dashboard;