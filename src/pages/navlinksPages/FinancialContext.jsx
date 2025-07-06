import React, { createContext, useContext, useState, useEffect } from 'react';

const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  // Start with empty budgets array
  const [budgets, setBudgets] = useState([]);

  // Start with empty transactions array
  const [transactions, setTransactions] = useState([]);

  const [financialGoals, setFinancialGoals] = useState([
    {
      id: 1,
      goal: 'Emergency Fund',
      current: 0,
      target: 2000,
      percentage: 0
    },
    {
      id: 2,
      goal: 'Vacation Fund',
      current: 0,
      target: 1500,
      percentage: 0
    },
    {
      id: 3,
      goal: 'New Car',
      current: 0,
      target: 8000,
      percentage: 0
    }
  ]);

  // Budget CRUD operations
  const addBudget = (newBudget) => {
    const budget = {
      id: Date.now(),
      category: newBudget.category,
      budget: parseFloat(newBudget.budget),
      spent: 0,
      color: newBudget.color
    };
    setBudgets(prev => [...prev, budget]);
  };

  const updateBudget = (budgetId, updatedBudget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId 
        ? { ...budget, ...updatedBudget }
        : budget
    ));
  };

  const deleteBudget = (budgetId) => {
    setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
  };

  const updateBudgetSpending = (budgetId, amount) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId 
        ? { ...budget, spent: Math.max(0, budget.spent + amount) }
        : budget
    ));

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
        setTransactions(prev => [transaction, ...prev]);
      }
    }
  };

  // Transaction CRUD operations
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);

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

  const updateTransaction = (transactionId, updatedTransaction) => {
    const oldTransaction = transactions.find(t => t.id === transactionId);
    
    setTransactions(prev => prev.map(transaction => 
      transaction.id === transactionId 
        ? { ...transaction, ...updatedTransaction }
        : transaction
    ));

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

  const deleteTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    setTransactions(prev => prev.filter(t => t.id !== transactionId));

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

  const value = {
    budgets,
    transactions,
    financialGoals,
    addBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpending,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getAnalyticsData,
    getOverviewData,
    setFinancialGoals,
    exportToExcel
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};