import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { budgetAPI, transactionAPI, todoAPI, goalAPI } from '../../api/userApi';

const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  // Use localStorage as fallback and for offline mode
  const [budgets, setBudgets] = useLocalStorage('financial_budgets', []);
  const [transactions, setTransactions] = useLocalStorage('financial_transactions', []);
  const [financialGoals, setFinancialGoals] = useLocalStorage('financial_goals', []);
  const [todos, setTodos] = useLocalStorage('financial_todos', []);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from server on mount if authenticated and online
  useEffect(() => {
    if (isAuthenticated() && isOnline) {
      loadAllData();
    }
  }, [isOnline]);

  // Auto-save data every 30 seconds as backup
  useEffect(() => {
    const interval = setInterval(() => {
      // Force save current state to localStorage
      localStorage.setItem('financial_budgets', JSON.stringify(budgets));
      localStorage.setItem('financial_transactions', JSON.stringify(transactions));
      localStorage.setItem('financial_goals', JSON.stringify(financialGoals));
      localStorage.setItem('financial_todos', JSON.stringify(todos));
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [budgets, transactions, financialGoals, todos]);

  // Load all data from server
  const loadAllData = async () => {
    if (!isAuthenticated() || !isOnline) return;

    setLoading(true);
    setError(null);

    try {
      const [budgetsRes, transactionsRes, todosRes, goalsRes] = await Promise.all([
        budgetAPI.getAll().catch(() => ({ data: [] })),
        transactionAPI.getAll().catch(() => ({ data: [] })),
        todoAPI.getAll().catch(() => ({ data: [] })),
        goalAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setBudgets(budgetsRes.data || []);
      setTransactions(transactionsRes.data || []);
      setTodos(todosRes.data || []);
      setFinancialGoals(goalsRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from server. Using local data.');
    } finally {
      setLoading(false);
    }
  };

  // Generic API call wrapper
  const apiCall = async (apiFunction, localUpdate, errorMessage) => {
    if (!isAuthenticated() || !isOnline) {
      // If offline or not authenticated, just update locally
      localUpdate();
      return;
    }

    try {
      const result = await apiFunction();
      localUpdate();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(errorMessage);
      // Still update locally as fallback
      localUpdate();
      throw err;
    }
  };

  // Budget CRUD operations
  const addBudget = async (newBudget) => {
    const budget = {
      id: Date.now(),
      category: newBudget.category,
      budget: parseFloat(newBudget.budget),
      spent: 0,
      color: newBudget.color
    };

    await apiCall(
      () => budgetAPI.create(budget),
      () => setBudgets(prev => [...prev, budget]),
      'Failed to create budget'
    );
  };

  const updateBudget = async (budgetId, updatedBudget) => {
    await apiCall(
      () => budgetAPI.update(budgetId, updatedBudget),
      () => setBudgets(prev => prev.map(budget => 
        budget.id === budgetId 
          ? { ...budget, ...updatedBudget }
          : budget
      )),
      'Failed to update budget'
    );
  };

  const deleteBudget = async (budgetId) => {
    await apiCall(
      () => budgetAPI.delete(budgetId),
      () => setBudgets(prev => prev.filter(budget => budget.id !== budgetId)),
      'Failed to delete budget'
    );
  };

  const updateBudgetSpending = async (budgetId, amount) => {
    await apiCall(
      () => budgetAPI.updateSpending(budgetId, amount),
      () => setBudgets(prev => prev.map(budget => 
        budget.id === budgetId 
          ? { ...budget, spent: Math.max(0, budget.spent + amount) }
          : budget
      )),
      'Failed to update budget spending'
    );

    // Add transaction when spending is updated
    if (amount !== 0) {
      const budget = budgets.find(b => b.id === budgetId);
      if (budget) {
        const transaction = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          description: amount > 0 ? `Expense in ${budget.category}` : `Refund in ${budget.category}`,
          category: budget.category,
          amount: amount,
          type: amount > 0 ? 'expense' : 'income',
          status: 'completed'
        };
        await addTransaction(transaction);
      }
    }
  };

  // Transaction CRUD operations
  const addTransaction = async (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      status: 'completed'
    };

    await apiCall(
      () => transactionAPI.create(newTransaction),
      () => setTransactions(prev => [newTransaction, ...prev]),
      'Failed to create transaction'
    );

    // Update budget spending if category matches
    if (transaction.type === 'expense') {
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        setBudgets(prev => prev.map(b => 
          b.id === budget.id 
            ? { ...b, spent: b.spent + Math.abs(transaction.amount) }
            : b
        ));
      }
    }
  };

  const updateTransaction = async (transactionId, updatedTransaction) => {
    const oldTransaction = transactions.find(t => t.id === transactionId);
    
    await apiCall(
      () => transactionAPI.update(transactionId, updatedTransaction),
      () => setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, ...updatedTransaction }
          : transaction
      )),
      'Failed to update transaction'
    );

    // Update budget spending if category changed
    if (oldTransaction && oldTransaction.type === 'expense') {
      const oldBudget = budgets.find(b => b.category === oldTransaction.category);
      if (oldBudget) {
        setBudgets(prev => prev.map(b => 
          b.id === oldBudget.id 
            ? { ...b, spent: Math.max(0, b.spent - Math.abs(oldTransaction.amount)) }
            : b
        ));
      }
    }

    if (updatedTransaction.type === 'expense') {
      const newBudget = budgets.find(b => b.category === updatedTransaction.category);
      if (newBudget) {
        setBudgets(prev => prev.map(b => 
          b.id === newBudget.id 
            ? { ...b, spent: b.spent + Math.abs(updatedTransaction.amount) }
            : b
        ));
      }
    }
  };

  const deleteTransaction = async (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    await apiCall(
      () => transactionAPI.delete(transactionId),
      () => setTransactions(prev => prev.filter(t => t.id !== transactionId)),
      'Failed to delete transaction'
    );

    // Update budget spending if it was an expense
    if (transaction && transaction.type === 'expense') {
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        setBudgets(prev => prev.map(b => 
          b.id === budget.id 
            ? { ...b, spent: Math.max(0, b.spent - Math.abs(transaction.amount)) }
            : b
        ));
      }
    }
  };

  // Todo CRUD operations
  const addTodo = async (todo) => {
    const newTodo = {
      id: Date.now(),
      ...todo,
      createdAt: new Date().toISOString()
    };

    await apiCall(
      () => todoAPI.create(newTodo),
      () => setTodos(prev => [newTodo, ...prev]),
      'Failed to create todo'
    );

    return newTodo;
  };

  const updateTodo = async (todoId, updatedTodo) => {
    const updateData = { ...updatedTodo, updatedAt: new Date().toISOString() };

    await apiCall(
      () => todoAPI.update(todoId, updateData),
      () => setTodos(prev => prev.map(todo => 
        todo.id === todoId 
          ? { ...todo, ...updateData }
          : todo
      )),
      'Failed to update todo'
    );
  };

  const deleteTodo = async (todoId) => {
    await apiCall(
      () => todoAPI.delete(todoId),
      () => setTodos(prev => prev.filter(todo => todo.id !== todoId)),
      'Failed to delete todo'
    );
  };

  const toggleTodo = async (todoId) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updateData = { 
      completed: !todo.completed, 
      updatedAt: new Date().toISOString() 
    };

    await apiCall(
      () => todoAPI.toggle(todoId),
      () => setTodos(prev => prev.map(t => 
        t.id === todoId 
          ? { ...t, ...updateData }
          : t
      )),
      'Failed to toggle todo'
    );
  };

  // Calculate analytics data
  const getAnalyticsData = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0;

    // Calculate total budget amounts
    const totalBudgetAmount = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    const categoryBreakdown = budgets.map(budget => {
      const categoryExpenses = transactions
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const percentage = totalExpenses > 0 ? ((categoryExpenses / totalExpenses) * 100).toFixed(1) : 0;
      
      return {
        category: budget.category,
        amount: categoryExpenses,
        percentage: parseFloat(percentage),
        color: getColorValue(budget.color),
        budgetAmount: budget.budget,
        spent: budget.spent
      };
    }).filter(item => item.amount > 0 || item.budgetAmount > 0);

    const spendingTrends = generateSpendingTrends();

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      savingsRate,
      categoryBreakdown,
      spendingTrends,
      totalBudgetAmount,
      totalBudgetSpent
    };
  };

  const getColorValue = (colorName) => {
    const colors = {
      blue: '#3B82F6',
      green: '#10B981',
      red: '#EF4444',
      purple: '#8B5CF6',
      orange: '#F59E0B'
    };
    return colors[colorName] || colors.blue;
  };

  const generateSpendingTrends = () => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyData = months.map(month => {
      // Calculate actual data from transactions for recent months
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[transactionDate.getMonth()] === month;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        month,
        income: income || 0,
        expenses: expenses || 0,
        savings: (income || 0) - (expenses || 0)
      };
    });

    return monthlyData.map(data => ({
      ...data,
      income: Math.round(data.income),
      expenses: Math.round(data.expenses),
      savings: Math.round(data.savings)
    }));
  };

  // Get overview data
  const getOverviewData = () => {
    const analytics = getAnalyticsData();
    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetRemaining = totalBudget - totalSpent;

    return {
      totalBalance: analytics.totalIncome - analytics.totalExpenses,
      monthlyIncome: analytics.totalIncome,
      monthlyExpenses: analytics.totalExpenses,
      savingsGoalProgress: financialGoals[0]?.current || 0,
      savingsGoalTarget: financialGoals[0]?.target || 2000,
      totalBudget,
      totalSpent,
      budgetRemaining,
      savingsRate: analytics.savingsRate
    };
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Type', 'Status'],
      ...transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.amount,
        t.type,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Data management functions
  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all financial data? This action cannot be undone.')) {
      setBudgets([]);
      setTransactions([]);
      setFinancialGoals([]);
      setTodos([]);
      localStorage.removeItem('financial_budgets');
      localStorage.removeItem('financial_transactions');
      localStorage.removeItem('financial_goals');
      localStorage.removeItem('financial_todos');
    }
  };

  const exportAllData = () => {
    const allData = {
      budgets,
      transactions,
      financialGoals,
      todos,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.budgets) setBudgets(data.budgets);
      if (data.transactions) setTransactions(data.transactions);
      if (data.financialGoals) setFinancialGoals(data.financialGoals);
      if (data.todos) setTodos(data.todos);
      return { success: true, message: 'Data imported successfully!' };
    } catch (error) {
      return { success: false, message: 'Invalid file format. Please select a valid backup file.' };
    }
  };

  const value = {
    budgets,
    transactions,
    financialGoals,
    todos,
    loading,
    error,
    isOnline,
    isAuthenticated: isAuthenticated(),
    addBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpending,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getAnalyticsData,
    getOverviewData,
    setFinancialGoals,
    exportToExcel,
    clearAllData,
    exportAllData,
    importData,
    loadAllData
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};