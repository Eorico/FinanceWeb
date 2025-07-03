import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Plus, Minus } from 'lucide-react';

function BudgetTracker() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Food & Dining', budget: 800, spent: 520, color: 'blue' },
    { id: 2, category: 'Transportation', budget: 300, spent: 180, color: 'green' },
    { id: 3, category: 'Entertainment', budget: 200, spent: 240, color: 'red' },
    { id: 4, category: 'Shopping', budget: 400, spent: 280, color: 'purple' },
    { id: 5, category: 'Utilities', budget: 250, spent: 195, color: 'orange' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', budget: '', color: 'blue' });

  const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgets.reduce((sum, item) => sum + item.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  const getPercentage = (spent, budget) => Math.min((spent / budget) * 100, 100);
  
  const getStatusIcon = (spent, budget) => {
    const percentage = getPercentage(spent, budget);
    if (percentage >= 100) return <AlertTriangle size={16} className="text-red-500" />;
    if (percentage >= 80) return <AlertTriangle size={16} className="text-yellow-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.budget) {
      setBudgets([...budgets, {
        id: Date.now(),
        category: newBudget.category,
        budget: parseFloat(newBudget.budget),
        spent: 0,
        color: newBudget.color
      }]);
      setNewBudget({ category: '', budget: '', color: 'blue' });
      setShowAddForm(false);
    }
  };

  const adjustSpending = (id, amount) => {
    setBudgets(budgets.map(budget => 
      budget.id === id 
        ? { ...budget, spent: Math.max(0, budget.spent + amount) }
        : budget
    ));
  };

  return (
    <section className="budget-tracker">
      <div className="section-header">
        <div>
          <h2 className="section-title">Budget Tracker</h2>
          <p className="section-subtitle">Monitor your spending across categories</p>
        </div>
        <button 
          className="add-budget-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Overall Budget Summary */}
      <div className="budget-summary">
        <div className="summary-header">
          <div className="summary-icon">
            <Target size={24} />
          </div>
          <div className="summary-content">
            <h3>Overall Budget</h3>
            <div className="summary-amounts">
              <span className="total-budget">${totalBudget.toLocaleString()}</span>
              <span className="spent-amount">${totalSpent.toLocaleString()} spent</span>
            </div>
          </div>
          <div className="summary-percentage">
            <span className={`percentage ${overallPercentage >= 90 ? 'danger' : overallPercentage >= 70 ? 'warning' : 'safe'}`}>
              {overallPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overall-progress">
          <div 
            className={`progress-fill ${overallPercentage >= 90 ? 'danger' : overallPercentage >= 70 ? 'warning' : 'safe'}`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Add Budget Form */}
      {showAddForm && (
        <div className="add-budget-form">
          <form onSubmit={handleAddBudget}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Category name"
                value={newBudget.category}
                onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                className="category-input"
              />
              <input
                type="number"
                placeholder="Budget amount"
                value={newBudget.budget}
                onChange={(e) => setNewBudget({...newBudget, budget: e.target.value})}
                className="budget-input"
              />
              <select
                value={newBudget.color}
                onChange={(e) => setNewBudget({...newBudget, color: e.target.value})}
                className="color-select"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
              </select>
              <button type="submit" className="submit-budget-btn">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Categories */}
      <div className="budget-categories">
        {budgets.map((budget) => {
          const percentage = getPercentage(budget.spent, budget.budget);
          const remaining = budget.budget - budget.spent;
          
          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-header">
                <div className="category-info">
                  <h4 className="category-name">{budget.category}</h4>
                  <div className="budget-amounts">
                    <span className="spent">${budget.spent.toLocaleString()}</span>
                    <span className="separator">of</span>
                    <span className="total">${budget.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="budget-status">
                  {getStatusIcon(budget.spent, budget.budget)}
                  <span className={`percentage ${percentage >= 100 ? 'over-budget' : percentage >= 80 ? 'warning' : 'on-track'}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="progress-container">
                <div className="progress-track">
                  <div 
                    className={`progress-bar progress-${budget.color} ${percentage >= 100 ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="budget-footer">
                <div className="remaining-amount">
                  {remaining >= 0 ? (
                    <span className="remaining-positive">${remaining.toLocaleString()} remaining</span>
                  ) : (
                    <span className="remaining-negative">${Math.abs(remaining).toLocaleString()} over budget</span>
                  )}
                </div>
                <div className="budget-controls">
                  <button 
                    className="adjust-btn decrease"
                    onClick={() => adjustSpending(budget.id, -50)}
                    title="Decrease spending by $50"
                  >
                    <Minus size={14} />
                  </button>
                  <button 
                    className="adjust-btn increase"
                    onClick={() => adjustSpending(budget.id, 50)}
                    title="Increase spending by $50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BudgetTracker;