import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Threads from './ui/Threads';
import BudgetTracker from './ui/BudgetTracker';
import TodoList from './ui/TodoList';
import Settings from './ui/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './ui/Layout';
import TransactionsTable from './ui/TransactionTable';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* Threads background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
      }}>
        <Threads
          color={[1, 1, 1]} // customize color if you want
          amplitude={1}
          distance={0.5}
          enableMouseInteraction={true}
        />
      </div>
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
        {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="budgetracker" element={<BudgetTracker />} />
            <Route path="transactions" element={<TransactionsTable />} />
            <Route path="todolist" element={<TodoList />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;